from xdj_apps.xmcs.controllers.commons import CommonController
import xdj
@xdj.Controller(
    url="library",
    template="librabry.html"
)
class LibrabryController(CommonController):
    def on_get(self,model):
        if isinstance(model,xdj.Model):
            return self.render(model)
    @xdj.Page(
        url="editor",
        template="librabry_editor.html"
    )
    class editor(object):
        def DoLoadLibrary(self,model):
            from xdj_models.models import CoursewareUserOrgs
            if CoursewareUserOrgs().objects.filter(User=model.user).count() == 0:
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
        def DoCreateLibrary(self,model):
            if not model.post_data.data.has_key("name"):
                return dict(
                    error="missing",
                    field="name"
                )
            if not model.post_data.data.has_key("number"):
                return dict(
                    error="missing",
                    field="number"
                )
            data = model.post_data.data
            from xdj_models.models import CoursewareUserOrgs
            import datetime
            user_org = CoursewareUserOrgs().objects.get(User=model.user)

            from xdj_models.models import CoursewareOrgs
            from opaque_keys.edx.locator import LibraryLocator


            org = CoursewareOrgs().objects.get(id=user_org.Org_id)
            from xdj_models.models import Libraries
            lib = Libraries().objects.create()
            lib.user = model.user
            lib.name = data["name"]
            lib.description = data.get("description",None)
            lib.created_on = datetime.datetime.utcnow()
            lib.key = LibraryLocator(org=org.OrgCode, library=data['number']).html_id()
            lib.save()
            model.request._body = xdj.JSON.to_json(dict(
                display_name=data["name"],
                org=org.OrgCode,
                number=data["number"]
            ))
            from contentstore.views.library import library_handler
            ret = library_handler(model.request)
            from xdj import JSON
            if hasattr(ret,"getvalue"):
                return JSON.from_json(ret.getvalue())
            x=ret
    @xdj.Page(
        template="library_selector.html",
        url="selector"

    )
    class selector(object):


        def DoLoadItems(self,model):
            from xdj_models.models import Libraries
            return  list(Libraries().objects.filter(user=model.user).all())

