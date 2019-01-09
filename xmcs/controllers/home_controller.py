import xdj
@xdj.Controller(
    url="home",
    replace_url_=r"^home1/?$",
    template = "home.html",
    check_url = r"^home/?$"
)
class HomeController(xdj.BaseController):
    def on_get(self,model):
        return None
    def GetListOfCourseWares(self,model):
        from xmodule.modulestore.django import modulestore
        return dict(
            message="pedding at {0}".format("/home/nttlong/code/edx/apps/edx/edx-platform/xdj_apps/xmcs/controllers/home_controller.py")
        )
        # return modulestore().get_courses()

        # return self.render(model)
