import xdj
@xdj.Controller(
    url="profile",
    template="profile.html",
    replace_url=r"^u/ ^(?P<username>[\w .@_+-]+)$"
)
class ProfileController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)