import xdj
@xdj.Controller(
    url="org/(?P<org>.*)",
    template="courseware_org.html"
)
class CoursewareOrgController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)
