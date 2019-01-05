import xdj
@xdj.Controller(
    url="home",
    replace_url_=r"^home/?$",
    template = "home.html"
)
class HomeController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)