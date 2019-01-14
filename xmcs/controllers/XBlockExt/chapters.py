import xdj

class Chapter(xdj.Handler):
    def __init__(self,model):
        super(type(self),self).__init__(model)
    def OnBeforeHandler(self,model):
        pass
    def OnAfterHandler(self,model):
        from xdj_apps.xmcs.controllers.XBlockExt import utils
        data = self.from_json(model.origin_result.getvalue())
        x = utils.get_usage_key(data["locator"])
        from xdj_models.models import Chapter
        if Chapter().objects.filter(chapter_id=x.block_id).count() == 0:
            chapter = Chapter().objects.create()
            chapter.user = model.user
            chapter.chapter_id = x.block_id
            chapter.display_name = model.post_data.display_name
            chapter.course_id = x.course_key
            chapter.created_on = utils.get_utc_now()
            chapter.save()
