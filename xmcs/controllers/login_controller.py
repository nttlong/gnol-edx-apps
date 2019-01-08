import xdj
from xdj_apps.xmcs.controllers.commons import CommonController
@xdj.Controller(
    url="login",
    template = "login.html",
    replace_url=r"^signin$"
)
class LoginController(CommonController):
    def on_get(self,model):
        model.error = None
        return self.render(model)

    def on_post(self,model):
        if isinstance(model,xdj.Model):
            id= model.post_data.id[0]
            username = id
            if self.__is_email__(id):
                user = self.__find_user_by_email__(id)
                if user == None:
                    model.error = xdj.dobject(
                        error=True,
                        message=(model._ > "'{0}' was not found").format(id)
                    )
                    return self.render(model)
                username = user.username
            from django.contrib.auth import authenticate, login
            user = authenticate(username=username, password=model.post_data.pwd[0])
            if user == None:
                model.error = xdj.dobject(
                    error=True,
                    message=(model._ > "Login fail")
                )
                return self.render(model)
            login(model.request, user)
            return model.redirect(model.absUrl)
