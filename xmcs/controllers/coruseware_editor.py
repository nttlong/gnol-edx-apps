import xdj
from xdj_apps.xmcs.controllers.commons import CommonController
@xdj.Controller(
    url="editor",
    template="editor.html",
    replace_url_=r"^course/(?P<course_key_string>[^/+]+(/|\+)[^/+]+(/|\+)[^/?]+)?$",
    check_url =r"^course/(?P<course_key_string>[^/+]+(/|\+)[^/+]+(/|\+)[^/?]+)?$"
)
class RegisterController(CommonController):
    def on_get(self,model):
        if self.__check_is_creator_of_courseware__(model.params.course_key_string,model.user):
            return None
        else:
            return self.render(model)

    def on_post(self, model):
        pass
        # return self.render(model)