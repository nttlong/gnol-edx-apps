from xdj_apps.xmcs.controllers.commons import CommonController
import xdj
@xdj.Controller(
    url="courseware/list",
    template="courseware_list.html"
)
class CoursewareListController(CommonController):
    def on_get(self,model):
        return self.render(model)
    def LoadItems(self,model):

        ret = []


        for item in self.__get_CourseOverview_Model__().objects.prefetch_related("courseauthors_set").filter(courseauthors__user=model.user):
            ret.append(dict(
                display_name=item.display_name,
                id=item.id.html_id(),
                image_urls=item.image_urls,
                short_description = item.short_description,
                start = item.start,
                end = item.end,
                enrollment_start=item.enrollment_start,
                enrollment_end=item.enrollment_end,

            ))


        return ret
