import xdj
@xdj.Controller(
    url="system/orgs",
    template="system/orgs.html"
)
class SystemOrgsController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)
    def DoLoadItems(self,model):
        from xdj_models.models import CoursewareOrgs
        ret =list(CoursewareOrgs().objects.all())
        return ret
    @xdj.Page(
        url="org",
        template="system/org.html"
    )
    class org(object):
        def DoLoadItem(self,model):
            if not model.post_data.__dict__.has_key("OrgCode"):
                return {}
            else:
                from xdj_models.models import CoursewareOrgs

                CoursewareOrgs()
        def DoSaveItem(self,model):
            if isinstance(model,xdj.Model):
                OrgCode = model.post_data.__dict__.get("OrgCode","")
                OrgName = model.post_data.__dict__.get("OrgName", "")
                OrgFName = model.post_data.__dict__.get("OrgFName", OrgName)
                if OrgCode.__len__() == 0:
                    return dict(
                        error_field="OrgCode"
                    )
                if OrgName.__len__() == 0:
                    return dict(
                        error_field="OrgName"
                    )
                from xdj_models.models import CoursewareOrgs
                item = None
                if CoursewareOrgs().objects.filter(OrgCode=OrgCode).count()==0:
                    item = CoursewareOrgs().objects.create()
                else:
                    item = CoursewareOrgs().objects.get(OrgCode=OrgCode)
                item.OrgCode = OrgCode
                item.OrgName = OrgName
                item.OrgFName = OrgFName
                item.save()
