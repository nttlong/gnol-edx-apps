import xdj
@xdj.Controller(
    url="subjects",
    template="subjects.html"
)
class SubjectController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)