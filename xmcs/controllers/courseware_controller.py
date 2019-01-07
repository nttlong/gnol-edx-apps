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