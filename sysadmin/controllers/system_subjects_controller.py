import xdj
@xdj.Controller(
    url="system/subjects",
    template="system/subjects.html"
)
class SystemSubjectsController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)
    def DoLoadItems(self,model):
        from xdj_models.models import CourseSubjects
        return list(CourseSubjects().objects.all())
    @xdj.Page(
        url="subject",
        template="system/subject.html"
    )
    class subject(object):
        def DoSaveItem(self,model):
            from xdj_models.models import CourseSubjects
            if isinstance(model,xdj.Model):
                if model.post_data.__dict__.get("SubjectCode","") == "":
                    return dict(
                        errorType="missingField",
                        field="SubjectCode"
                    )
                if model.post_data.__dict__.get("SubjectName","") == "":
                    return dict(
                        errorType="missingField",
                        field="SubjectName"
                    )
                from datetime import datetime
                item = None
                if CourseSubjects().objects.filter(SubjectCode=model.post_data.SubjectCode).count() == 0:
                    item = CourseSubjects().objects.create()
                    item.CreatedOn = datetime.utcnow()
                    item.CreatedBy = model.user.username
                else:
                    item = CourseSubjects().objects.get(SubjectCode=model.post_data.SubjectCode)
                    item.ModifiedOn = datetime.utcnow()
                    item.ModifiedBy = model.user.username
                item.SubjectCode = model.post_data.SubjectCode
                item.SubjectName = model.post_data.SubjectName
                item.SubjectFName = model.post_data.__dict__.get("SubjectFName",item.SubjectName)
                item.SubjectDescription = model.post_data.__dict__.get("SubjectDescription", None)

                item.save()
            pass
