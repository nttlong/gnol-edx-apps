import xdj
@xdj.Controller(
    url="courseware",
    template="courseware.html"
)
class CoursewareController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)
    def DoCreateCourseWare(self,model):
        import cms.djangoapps.contentstore.views.course
        items = xdj.JSON.from_json(model.request.body)
        data = {}
        for x in items:
            k = x["name"].split("-")[x["name"].split("-").__len__() - 1]
            data.update({k: x["value"]})
        model.request.json =data
        model.request._body = xdj.JSON.to_json(data)
        ret = cms.djangoapps.contentstore.views.course._create_or_rerun_course(model.request)
        return ret
    def DoInit(self,model):
        if isinstance(model,xdj.Model):

            pass
    def DoLoadSubjects(self,model):
        from xdj_models.models import CourseSubjects
        return list(CourseSubjects().objects.all())
    def DoLoadItem(self,model):
        from xdj_models.models import CoursewareUserOrgs
        if CoursewareUserOrgs().objects.filter(User=model.user).count()==0:
            return dict(
                error="org_was_not_found"
            )
        from xdj_models.models import CoursewareOrgs
        from xdj_models.models import CoursewareUserOrgs
        u_org = CoursewareUserOrgs().objects.get(User=model.user)
        org = CoursewareOrgs().objects.get(id=u_org.Org_id)
        return dict(
            data=dict(
                Org=org.OrgCode
            )
        )
        pass