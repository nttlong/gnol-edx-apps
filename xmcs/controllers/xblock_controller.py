import xdj
@xdj.Controller(
    url="xblock",
    template="xblock.html",
    check_url=r"^xblock/(?P<usage_key_string>(?:i4x://?[^/]+/[^/]+/[^/]+/[^@]+(?:@[^/]+)?)|(?:[^/]+))?$"
)
class XBlockController(xdj.BaseController):
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
            if model.params.usage_key_string.count("+type@library+")>0:
                if model.params.usage_key_string[0:'lib-block-v1:'.__len__():]==u'lib-block-v1:':
                    self.UpdateLibName(model)
                    return None
            if model.params.usage_key_string.count("+type@chapter+")>0:
                self.UpdateChapter(model)
        return None