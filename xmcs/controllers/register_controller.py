import xdj
@xdj.Controller(
    url="register",
    template="register.html",
    replace_url=r"^signup$"
)
class RegisterController(xdj.BaseController):
    def on_get(self,model):
        model.ng_data = dict(
            error=dict(
                error_type=""
            ),
            data=dict(

            )
        )
        return self.render(model)
    def on_post(self,model):
        from django.contrib.auth.models import User
        from xdj import send_email
        model.ng_data = dict(
            error=dict(
                error_type=""
            ),
            data=dict(
                orgName = model.post_data.org_name[0],
                orgCode = model.post_data.org_code[0],
                username = model.post_data.username[0],
                email = model.post_data.email[0]
            )
        )
        if User.objects.filter(username=model.post_data.username[0]).count()>0:
            model.ng_data["error"]["error_type"] = "user_exist"
            return self.render(model)
        if User.objects.filter(email=model.post_data.email[0]).count()>0:
            model.ng_data["error"]["error_type"] = "email_exist"
            return self.render(model)
        from xdj_models.models import CoursewareOrgs
        if CoursewareOrgs().objects.filter(OrgCode=model.post_data.org_code[0]).count()>0:
            model.ng_data["error"]["error_type"] = "org_code_exist"
            return self.render(model)
        org = CoursewareOrgs().objects.create(OrgCode=model.post_data.org_code[0], OrgName=model.post_data.org_name[0])
        org.OrgFName = model.post_data.org_name[0]
        import datetime
        org.CreatedOn = datetime.datetime.utcnow()
        org.save()
        user = User.objects.create_user(
            model.post_data.username[0],
            model.post_data.email[0],
            model.post_data.password[0]
        )
        user.is_staff = True
        user.is_active = False
        user.save()

        from xdj_models.models import CoursewareUserOrgs
        uo = CoursewareUserOrgs().objects.create()
        uo.User = user
        uo.Org = org
        uo.save()

        from xdj import pymqr,medxdb
        from django.conf import settings
        import uuid
        token = uuid.uuid4().__str__()
        qr = pymqr.query(medxdb.db(),settings.COLLECTION_TOKENS)

        qr.insert(
            token=token,
            username = model.post_data.username[0],
            created_on = datetime.datetime.utcnow()
        ).commit()


        send_email.send_email_by_template(
            model.post_data.email[0],
            model.request.LANGUAGE_CODE,
            "cms_register_activation_email",
            "about:Active account",
            "Hi {{username}}\n"
            "in order to active your account please click <a href='{{url}}'>{{url}}</a>\n"
            "Thanks", {
                "username": model.post_data.username[0],
                "url": model.appUrl + "/active_account/{0}".format(token)
            }
        )
        return model.redirect(model.appUrl+"/register_message")

