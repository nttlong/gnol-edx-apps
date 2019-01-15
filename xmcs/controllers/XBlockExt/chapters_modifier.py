import xdj

from xdj_apps.xmcs.controllers.XBlockExt import utils
class ChaptersModifier(xdj.Handler):
    def OnBeforeHandler(self,model):
        pass
    def OnAfterHandler(self,model):
        if model.request.method == "DELETE":
            from xdj_models.models import Vertical, Sequential, XBlock,Chapter

            x = utils.get_usage_key(model.params.usage_key_string)
            sequentials = Sequential().objects.filter(chapter_id=x.block_id)
            for s in sequentials:
                verticals = Vertical().objects.filter(sequential_id=s.sequential_id).all()
                for v in verticals:
                    XBlock().objects.filter(vertical_id=v.vertical_id).delete()
                Vertical().objects.filter(sequential_id=s.sequential_id).delete()
            Sequential().objects.filter(chapter_id=x.block_id).delete()
            Chapter().objects.filter(chapter_id=x.block_id).delete()
        else:
            from xdj_models.models import Chapter
            data = self.from_json(model.origin_result.getvalue())
            x= utils.get_usage_key(data.get("id",data.get("locator")))
            if Chapter().objects.filter(chapter_id=x.block_id).count()==0:
                chapter = Chapter().objects.create(chapter_id =x.block_id)
                chapter.creator = model.user
                if model.request.method =="PATCH":
                    chapter.display_name = data["metadata"]["display_name"]
                else:
                    chapter.display_name = model.post_data.display_name
                chapter.course_id = x.course_key
                chapter.created_on = utils.get_utc_now()
                chapter.save()
            else:
                chapter = Chapter().objects.get(chapter_id=x.block_id)
                chapter.display_name = data["metadata"]["display_name"]
                chapter.modifier = model.user
                chapter.save()



        pass