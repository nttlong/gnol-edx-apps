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
        from xdj_apps.xmcs.controllers.XBlockExt import utils
        if model.params.usage_key_string:
            x = utils.get_usage_key(model.params.usage_key_string)

            if hasattr(model.post_data, "publish") and model.post_data.publish == "make_public":
                from xdj_apps.xmcs.controllers.XBlockExt.publisher import Publisher
                return Publisher(model)
            if x.block_type=="sequential":
                from xdj_apps.xmcs.controllers.XBlockExt.sequential_modifier import  SequentialModifier
                return SequentialModifier(model)
            if x.block_type=="vertical":
                from xdj_apps.xmcs.controllers.XBlockExt.vertical_modifier import VerticalModifier
                return  VerticalModifier(model)
            if x.block_type == "library":
                if model.params.usage_key_string[0:'lib-block-v1:'.__len__():]==u'lib-block-v1:':
                    from xdj_apps.xmcs.controllers.XBlockExt.libraries import Library
                    # self.UpdateLibName(model)
                    return Library(model)
            if x.block_type == "chapter":
                from xdj_apps.xmcs.controllers.XBlockExt.chapters_modifier import ChaptersModifier
                return ChaptersModifier(model)
            if x.block_type == "problem":
                from xdj_apps.xmcs.controllers.XBlockExt.xblock_modifier import XBlockModifier
                return XBlockModifier(model)

        else:
            if model.post_data.category == "chapter":
                from xdj_apps.xmcs.controllers.XBlockExt.chapters_modifier import ChaptersModifier
                return ChaptersModifier(model)
            if model.post_data.category=="chapter":
                from xdj_apps.xmcs.controllers.XBlockExt.chapters_modifier import ChaptersModifier
                return ChaptersModifier(model)
            if model.post_data.category =="sequential":
                from xdj_apps.xmcs.controllers.XBlockExt.sequential_modifier import SequentialModifier
                return SequentialModifier(model)
            if model.post_data.category =="vertical":
                from xdj_apps.xmcs.controllers.XBlockExt.vertical_modifier import VerticalModifier
                return VerticalModifier(model)
            if model.post_data.category=="library_content":
                from xdj_apps.xmcs.controllers.XBlockExt.library_content import LibraryContent
                return LibraryContent(model)
            else:
                from xdj_apps.xmcs.controllers.XBlockExt.xblock_modifier import XBlockModifier
                return XBlockModifier(model)
            # if model.post_data.parent_locator.count("+type@vertical+block@")>0:
            #     from xdj_apps.xmcs.controllers.XBlockExt.xblock import XBlock
            #     return XBlock(model)


            # self.DoTrackingNewItem(model)
        return None