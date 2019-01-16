import xdj
@xdj.Controller(
    url="register_message",
    template="register_message.html"
)
class RegisterMessageController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)