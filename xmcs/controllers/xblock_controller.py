import xdj
@xdj.Controller(
    url="xblock",
    template="xblock.html",
    check_url=r"^xblock/(?P<usage_key_string>(?:i4x://?[^/]+/[^/]+/[^/]+/[^@]+(?:@[^/]+)?)|(?:[^/]+))?$"
)
class XBlockController(xdj.BaseController):
    def DoTrackingNewItem(self,model):
        if model.post_data.parent_locator:
            if model.post_data.parent_locator.count("+type@course+block@course")>0:
                if model.post_data.category=="chapter":
                    self.DoCreateChapter(model)
                x=model.post_data

    def UpdateLibName(self,model):
        items = model.params.usage_key_string.split(':')[1].split('+')
        from opaque_keys.edx.locator import LibraryLocator
        id = LibraryLocator(org=items[0], library=items[1])
        from xdj import JSON
        data = JSON.from_json(model.request.body)
        from xdj_models.models import Libraries
        lib = Libraries().objects.get(key=id.html_id())
        lib.name = data["metadata"]["display_name"]
        lib.save()
    def UpdateChapter(self,model):
        return None
    def on_get(self,model):
        if model.request.method=="POST":
            print model.params.usage_key_string
        if model.params.usage_key_string[0:'lib-block-v1:'.__len__():]==u'lib-block-v1:' and model.request.method=="POST":
            pass
        else:
            return None
        pass
    def on_post(self,model):
        if model.params.usage_key_string:
            if model.params.usage_key_string.count("+type@vertical+block@")>0:
                from xdj_apps.xmcs.controllers.XBlockExt.vertical_modifier import VerticalModifier
                return  VerticalModifier(model)
            if model.params.usage_key_string.count("+type@library+")>0:
                if model.params.usage_key_string[0:'lib-block-v1:'.__len__():]==u'lib-block-v1:':
                    from xdj_apps.xmcs.controllers.XBlockExt.libraries import Library
                    # self.UpdateLibName(model)
                    return Library(model)
            if model.params.usage_key_string.count("+type@chapter+")>0:
                self.UpdateChapter(model)
            if model.params.usage_key_string.count("+type@problem+block@")>0:
                from  xdj_apps.xmcs.controllers.XBlockExt.problems import Problem
                return Problem(model)

        else:
            if model.post_data.category=="chapter" and model.post_data.parent_locator.count("+type@course+block@course")>0:
                from xdj_apps.xmcs.controllers.XBlockExt.chapters import Chapter
                return Chapter(model)
            if model.post_data.category =="sequential" and model.post_data.parent_locator.count("+type@chapter+block@")>0:
                from xdj_apps.xmcs.controllers.XBlockExt.sequential import Sequential
                return Sequential(model)
            if model.post_data.category =="vertical" and model.post_data.parent_locator.count("+type@sequential+block@")>0:
                from xdj_apps.xmcs.controllers.XBlockExt.vertical import Vertical
                return Vertical(model)

            self.DoTrackingNewItem(model)
        return None