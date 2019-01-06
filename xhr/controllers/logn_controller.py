import xdj
@xdj.Controller(
    url="login",
    template="login.html"
)
class LoginController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)