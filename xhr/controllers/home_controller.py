import xdj
@xdj.Controller(
    url="",
    template="home.html"
)
class HomeController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)