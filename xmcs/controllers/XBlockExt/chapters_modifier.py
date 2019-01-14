import xdj

from xdj_apps.xmcs.controllers.XBlockExt import utils
class ChaptersModifier(xdj.Handler):
    def OnBeforeHandler(self,model):
        pass
    def OnAfterHandler(self,model):
        from xdj_models.models import Chapter
        data = self.from_json(model.origin_result.getvalue())
        x= utils.get_usage_key(data["id"])
        if Chapter().objects.filter(chapter_id=x.block_id).count()==0:
            chapter = Chapter().objects.create()
            chapter.user = model.user
            chapter.display_name =data["metadata"]["display_name"]
            chapter.chapter_id =x.block_id
            chapter.course_id = x.course_key
            chapter.created_on = utils.get_utc_now()
            chapter.save()
        else:
            chapter = Chapter().objects.get(chapter_id=x.block_id)
            chapter.display_name = data["metadata"]["display_name"]
            chapter.save()



        pass