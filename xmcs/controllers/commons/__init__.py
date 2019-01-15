import xdj
from openedx.core.djangoapps.content.course_overviews.models import CourseOverview
class CommonController(xdj.BaseController):
    def __is_email__(self,txt):
        """
        Check is txtx describe an email?
        :param txt:
        :return:
        """
        import re
        match = re.match('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$', txt)
        return match!=None
    def __get_user_models__(self):
        from django.contrib.auth import get_user_model
        return get_user_model().objects
    def __get_CourseOverview_Model__(self):
        from xdj_models.models.course_authors import CourseAuthors

        from openedx.core.djangoapps.content.course_overviews.models import CourseOverview
        return CourseOverview

    def __find_user_by_email__(self,email):
        users = self.__get_user_models__().filter(email=email).all()
        if users.__len__() == 0:
            return None
        else:
            return users[0]
    def __get_course_id_from_text__(self,txt):
        from opaque_keys.edx.locator import CourseLocator
        return CourseLocator.from_string(txt)
    def __check_is_creator_of_courseware__(self,txt_course_id,user):
        from xdj_models.models import CourseAuthors
        x = list(CourseAuthors().objects.filter(course_id=self.__get_course_id_from_text__(txt_course_id)))
        if x.__len__()==0:
            return False
        else:
            return x[0].user.username == user.username
class StaffController(xdj.BaseController):
    def IsAllow(self,model):
        return model.user.is_staff







