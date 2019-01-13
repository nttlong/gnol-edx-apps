import xdj

class Chapter(xdj.Hanlder):
    def __init__(self,model):
        super(type(self),self).__init__(model)
    def OnBeforeHandler(self,model):
        pass
    def OnAfterHandler(self,model):
        items = self.from_json(model.origin_result.getvalue())["locator"].split("@")
        chapter_id = items[items.__len__() - 1]
        self.from_json(model.origin_result.getvalue())['courseKey']
        courseKey = self.from_json(model.origin_result.getvalue())['courseKey']
        from opaque_keys.edx.keys import CourseKey

        course_id = CourseKey.from_string(courseKey)
        Name = model.post_data.display_name

        from xdj_models.models import Chapter
        chapter = Chapter().objects.create()
        chapter.course_id = course_id
        chapter.chapter_id = chapter_id
        chapter.user = model.user
        chapter.display_name = Name
        from datetime import datetime
        chapter.created_on = datetime.utcnow()
        chapter.save()

        pass
