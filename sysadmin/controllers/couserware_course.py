import xdj


@xdj.Controller(
    url="couserware/courses",
    template="couserware/courses.html"
)
class couserware_couser_controller(xdj.BaseController):
    def on_get(self,sender):
        return self.render(sender)
    def doLoadItems(self,sender):
        """
        https://programtalk.com/python-examples-amp/student.models.anonymous_id_for_user/
        :param sender:
        :return:
        """

        import branding
        import courseware
        from xdj_models.enities import courseware as cw
        from xdj import pymqr
        from xdj import medxdb
        from django.contrib.auth.models import User
        import sysadmin
        import datetime
        from django.db.models import Q

        # courseware.models.StudentModule.objects.all()[0].student.last_name
        ret = branding.get_visible_courses()
        qr = pymqr.query(medxdb.db(), cw.modulestore_active_versions)
        for item in ret:
            # course = courseware.models.StudentModule.objects.get(course_id=item.id)
            x = qr.new().match(pymqr.filters.org==item.id.org)\
                .match(pymqr.filters.run==item.id.run)\
                .match(pymqr.filters.course==item.id.course).object

            #     .match(pymqr.funcs.expr(
            #     (pymqr.docs.org == item.id.org) &
            #     (pymqr.docs.run == item.id.run) &
            #     (pymqr.docs.course == item.id.course)
            # )).object
            from xdj_models.models import CourseAuthors
            fx=CourseAuthors()()
            item.course_id=item.id.__str__()
            if not x.is_empty():
                authors= User.objects.filter(id=x.edited_by)
                if authors.__len__()>0:
                    sql_items=CourseAuthors().objects.filter(Q(user_id=x.edited_by)&Q(course_id=item.id)).count()
                    item.author= xdj.dobject(username=authors[0].username)
                    if sql_items==0:
                        fx.user_id = x.edited_by
                        fx.course_id = item.id
                        fx.created_on = datetime.datetime.now()
                        fx.save()
            item.totalActiveStudent=courseware.models.StudentModule.objects.filter(course_id=item.id).filter(module_type="course").count()
            """calculate total activates students"""

        return ret
    def doDeleteItem(self,sender):
        from openedx.core.djangoapps.content.course_overviews.models import CourseOverview
        from opaque_keys import edx
        course_id = edx.locator.CourseLocator.from_string(sender.post_data.course_id)
        import openedx.core.djangoapps.models as md
        modulestorr = md.course_details.modulestore()
        modulestorr.delete_course(course_id,sender.user.id)
        CourseOverview.objects.filter(id=course_id).delete()
        """delete courseware by current user"""
        return {}
