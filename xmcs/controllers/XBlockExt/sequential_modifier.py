import xdj
class SequentialModifier(xdj.Handler):
    def OnBeforeHandler(self,model):
        pass
    def OnAfterHandler(self,model):
        if model.request.method == "DELETE":
            from xdj_models.models import Vertical,Sequential,XBlock
            from xdj_apps.xmcs.controllers.XBlockExt import utils
            x = utils.get_usage_key(model.params.usage_key_string)
            verticals =Vertical().objects.filter(sequential_id=x.block_id).all()
            for v in verticals:
                XBlock().objects.filter(vertical_id=v.vertical_id).delete()
            Vertical().objects.filter(sequential_id=x.block_id).delete()
            Sequential().objects.filter(sequential_id=x.block_id).delete()

        else:
            from xdj_models.models import Sequential
            from xdj_apps.xmcs.controllers.XBlockExt import utils
            from django.db.models import Q
            from xdj_models.models import Chapter
            data = self.from_json(model.origin_result.getvalue())
            x = utils.get_usage_key(data.get("id",data.get("locator")))
            parent_obj = utils.find_parent_from_mongodb(x.block_id)
            utils.create_object_if_not_exist(parent_obj,model.user,x.course_key)
            obj = utils.find_from_mongodb(x.block_id)
            utils.create_object_if_not_exist(obj, model.user, x.course_key,parent_obj["block_id"])

