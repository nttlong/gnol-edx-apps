import xdj

class Sequential(xdj.Hanlder):
    def OnBeforeHandler(self,model):
        return None
    def OnAfterHandler(self,model):
        from datetime import datetime
        ret_data = self.from_json(model.origin_result.getvalue())
        from opaque_keys.edx.keys import CourseKey
        course_id = CourseKey.from_string(ret_data["courseKey"])
        items = ret_data["locator"].split("@")
        sequential_id = items[items.__len__() - 1]
        Name = model.post_data.display_name

        from xdj_models.models import Chapter
        chapter_ids = model.post_data.parent_locator.split("@")
        chapter_id = chapter_ids[chapter_ids.__len__() - 1]
        from xdj_models.models import Sequential
        sequential = Sequential().objects.create()
        sequential.chapter_id= chapter_id
        sequential.user = model.user
        sequential.display_name = Name
        sequential.course_id = course_id
        sequential.sequential_id = sequential_id
        sequential.created_on =datetime.utcnow()
        sequential.save()
        return model.origin_result

