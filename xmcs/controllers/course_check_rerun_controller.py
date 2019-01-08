from xdj_apps.xmcs.controllers.commons import CommonController
import xdj
@xdj.Controller(
    url="course_rerun",
    check_url=r"^course_rerun/(?P<course_key_string>[^/+]+(/|\+)[^/+]+(/|\+)[^/?]+)$",
    template="editor.html"
)
class CourseReRunController(CommonController):
    def on_get(self, model):
        if self.__check_is_creator_of_courseware__(model.params.course_key_string, model.user):
            return None
        else:
            return self.render(model)
