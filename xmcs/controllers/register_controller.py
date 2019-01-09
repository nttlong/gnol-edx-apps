import xdj
@xdj.Controller(
    url="register",
    template="register.html",
    replace_url=r"^signup$"
)
class RegisterController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)
    def on_post(self,model):
        pass