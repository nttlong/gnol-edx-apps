import xdj
from docutils.utils.math.latex2mathml import mo


@xdj.Controller(
    url="register",
    replace_url=r"^register$",
    template="register.html"
)
class RegisterController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)
    def on_post(self,model):
        from django.contrib.auth.models import User
        from xdj import send_email,pymqr,medxdb
        from django.conf import settings
        model.ng_response = xdj.dobject(
            error_type="user_is_existing",
            data=xdj.dobject(
                username = model.post_data.username[0],
                email = model.post_data.email[0],
                firstname = model.post_data.firstname[0],
                lastname=model.post_data.lastname[0],

            )
        )
        count_of_users = User.objects.filter(username=model.post_data.username[0]).count()
        if count_of_users>0:
            model.ng_response.error_type="user_is_existing"
            return self.render(model)
        count_of_users = User.objects.filter(email=model.post_data.email[0]).count()
        if count_of_users>0:
            model.ng_response.error_type = "email_is_existing"
            return self.render(model)
        user = User.objects.create_user(model.post_data.username[0], model.post_data.email[0],
                                        model.post_data.password[0])
        user.first_name = model.post_data.firstname[0]
        user.last_name = model.post_data.lastname[0]
        user.is_active = False
        user.save()
        import uuid
        qr = pymqr.query(medxdb.db(), settings.COLLECTION_TOKENS)
        token = uuid.uuid4()
        token = uuid.uuid4().__str__()
        import datetime
        qr.insert(token=token, username=model.post_data.username[0], created_on=datetime.datetime.utcnow()).commit()
        data = dict(
            url=model.appUrl + "/active_account/" + token,
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
            register_on=datetime.datetime.utcnow()
        )
        send_email.send_email_by_template(
            user.email,
            model.request.LANGUAGE_CODE,
            "active_account_lms",
            "Active your account",
            "Hi {{username}},<br/> "
            "Please click <a url='{{url}}'>{{url}}</a> to active your account. <br/> "
            "Thank you for register.",
            data
        )

        return model.redirect(model.appUrl+"/register_message")