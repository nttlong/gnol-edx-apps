import xdj
from xdj_apps.xmcs.controllers.commons import StaffController
@xdj.Controller(
    url="home",
    replace_url_=r"^home1/?$",
    template = "home.html",
    check_url = r"^home/?$"
)
class HomeController(StaffController):
    def on_get(self,model):
        if self.IsAllow(model):
            return None
        else:
            return model.redirect("/signin?next="+model.request.path)
    def GetListOfCourseWares(self,model):
        from xmodule.modulestore.django import modulestore
        return dict(
            message="pedding at {0}".format("/home/nttlong/code/edx/apps/edx/edx-platform/xdj_apps/xmcs/controllers/home_controller.py")
        )
        # return modulestore().get_courses()

        # return self.render(model)
