import xdj
class XBlockModifier(xdj.Handler):
    def OnBeforeHandler(self,model):
        return None
    def OnAfterHandler(self,model):
        from xdj_apps.xmcs.controllers.XBlockExt import utils
        if model.request.method == "DELETE":
            from xdj_models.models import XBlock
            x = utils.get_usage_key(model.params.usage_key_string)
            XBlock().objects.filter(xblock_id=x.block_id).delete()
        else:
            data = self.from_json(model.origin_result.getvalue())
            x = utils.get_usage_key(data.get("id",data.get("locator")))
            vertical = utils.find_parent_from_mongodb(x.block_id)
            xblock = utils.find_from_mongodb(x.block_id)
            sequential = utils.find_parent_from_mongodb(vertical["block_id"])
            chapter = utils.find_parent_from_mongodb(sequential["block_id"])
            utils.create_object_if_not_exist(chapter, model.user, x.course_key)
            utils.create_object_if_not_exist(sequential, model.user, x.course_key, chapter["block_id"])
            utils.create_object_if_not_exist(vertical, model.user, x.course_key, sequential["block_id"])
            utils.create_object_if_not_exist(xblock, model.user, x.course_key, vertical["block_id"])
