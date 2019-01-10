from xdj_apps.xmcs.controllers.commons import CommonController
import xdj
@xdj.Controller(
    url="library",
    template="librabry.html"
)
class LibrabryController(CommonController):
    def on_get(self,model):
        if isinstance(model,xdj.Model):
            return self.render(model)
    @xdj.Page(
        url="editor",
        template="librabry_editor.html"
    )
    class editor(object):
        pass