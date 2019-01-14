import xdj

class Sequential(xdj.Handler):
    def OnBeforeHandler(self,model):
        return None
    def OnAfterHandler(self,model):
        from xdj_models.models import Sequential
        from xdj_apps.xmcs.controllers.XBlockExt import utils
        from django.db.models import Q

        data = self.from_json(model.origin_result.getvalue())

        x = utils.get_usage_key(data['locator'])
        parent = utils.get_usage_key(model.post_data.parent_locator)
        chapter_id = parent.block_id
        if Sequential().objects.filter(Q(chapter_id=chapter_id) & Q(sequential_id=x.block_id)).count() ==0:
            sequential = Sequential().objects.create()
            sequential.display_name = model.post_data.display_name
            sequential.sequential_id = x.block_id
            sequential.user = model.user
            sequential.course_id = x.course_key
            sequential.created_on = utils.get_utc_now()
            sequential.save()
        else:
            sequential = Sequential().objects.get(Q(chapter_id=chapter_id) & Q(sequential_id=x.block_id))
            sequential.display_name = model.post_data.display_name
            sequential.sequential_id = x.block_id
            sequential.user = model.user
            sequential.course_id = x.course_key
            sequential.created_on = utils.get_utc_now()
            sequential.save()


