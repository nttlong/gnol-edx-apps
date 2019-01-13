# VerticalModifier
import xdj

class VerticalModifier(xdj.Hanlder):
    def OnBeforeHandler(self,model):
        return None
    def OnAfterHandler(self,model):
        # from datetime import datetime
        # ret_data = self.from_json(model.origin_result.getvalue())
        # from opaque_keys.edx.keys import CourseKey
        # course_id = CourseKey.from_string(ret_data["courseKey"])
        # items = ret_data["locator"].split("@")
        # vertical_id = items[items.__len__() - 1]
        # Name = model.post_data.display_name
        # #
        # # from xdj_models.models import Chapter
        # sequential_ids = model.post_data.parent_locator.split("@")
        # sequential_id = sequential_ids[sequential_ids.__len__() - 1]
        # # chapter_id = chapter_ids[chapter_ids.__len__() - 1]
        # from xdj_models.models import Vertical
        # vertical = Vertical().objects.create()
        # vertical.sequential_id= sequential_id
        # vertical.user = model.user
        # vertical.display_name = Name
        # vertical.course_id = course_id
        # vertical.vertical_id = vertical_id
        # vertical.created_on =datetime.utcnow()
        # vertical.save()
        ret_data = self.from_json(model.origin_result.getvalue())
        items = ret_data["id"].split("@")
        item = items[items.__len__() - 1]
        from xdj_models.models import Vertical
        v = Vertical().objects.get(vertical_id=item)
        v.display_name = ret_data["metadata"]["display_name"]
        v.save()
        return model.origin_result