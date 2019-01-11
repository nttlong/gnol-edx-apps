#!/usr/bin/env python
# -*- coding: utf-8 -*-

import xdj

from xdj_apps.sysadmin.controllers.commons import RequireFieldError,FormController
@xdj.Controller(
    url="system/users",
    template="system/users.html"
)
class system_user_controller(xdj.BaseController):
    def __init__(self):
        pass
    def __get_user_models__(self):
        from django.contrib.auth import get_user_model
        return get_user_model().objects

    def on_get(self,sender):
        return self.render(sender)

    def doLoadItems(self,sender):
        """
        Get list of users
        :param sender:
        :return:
        """
        from django.db.models import Q

        users = self.__get_user_models__()
        totalItems = 0
        if hasattr(sender.post_data,"search"):
            users=users.filter(Q(username__icontains=sender.post_data.search)|
                               Q(first_name__icontains=sender.post_data.search)|
                               Q(last_name__icontains=sender.post_data.search)|
                               Q(email__icontains=sender.post_data.search))
        totalItems = users.count()
        totalPages=totalItems / sender.post_data.pageSize
        if totalItems % sender.post_data.pageSize >0:
            totalPages=totalPages+1
        items = list(users.values(

            "username",
            "first_name",
            "last_name",
            "is_active",
            "is_superuser",
            "is_staff",
            "last_login",
            "email",
            "date_joined"
        ).all()[sender.post_data.pageSize*sender.post_data.pageIndex:sender.post_data.pageSize])
        return dict(
            items=items,
            totalItems=totalItems,
            totalPages=totalPages
        )




    @xdj.Page(url="user", template="system/user.html")
    class user(FormController):
        def __init__(self):
            super(type(self),self).__init__()
        def doLoadItem(self,sender):
            """
            Get one user
            :param sender:
            :return:
            """
            if sender.post_data.username =='*':
                return {}
            else:
                users= self.owner.__get_user_models__()
                user = users.filter(username=sender.post_data.username).get()
                return user
        def doUpdateItem(self,sender):
            """
            Update account info
            :param sender:
            :return:
            """
            try:
                from xdj_models.models import CoursewareUserOrgs

                user_data= xdj.dobject(sender.post_data.user)

                users = self.owner.__get_user_models__().filter(username=user_data.username).all()
                if users.count()>0:
                    user=self.owner.__get_user_models__().get(username=user_data.username)
                    if sender.post_data.user.has_key("org"):
                        org = CoursewareUserOrgs()
                        if org.objects.filter(User=user).count()>0:
                            org.objects.get(User=user).delete()
                        _org = org.objects.create()
                        _org.User = user
                        _org.Org_id = int(sender.post_data.user["org"])
                        _org.save()

                    user.first_name= user_data.first_name
                    user.last_name = user_data.last_name
                    user.email = user_data.email
                    user.is_active = user_data.is_active
                    user.is_staff = user_data.is_staff
                    user.is_superuser=user_data.is_superuser
                    user.save()
                    return dict()
                else:
                    self.check_require_fields(sender.post_data.user, [
                        "username",
                        "email",
                        "password",
                        'confirmPassword'
                    ])
                    user = self.owner.__get_user_models__().create(
                        username=user_data.username,
                        email=user_data.email,
                        password=user_data.password
                    )
                    user.is_active = user_data.__dict__.get("is_active", False)
                    user.is_staff = user.__dict__.get("is_staff",False)
                    user.is_superuser = user_data.__dict__.get("is_superuser", False)
                    user.save()
                    return {}

            except RequireFieldError as ex:
                return dict(error = ex)
            except Exception as ex:
                raise ex

        def doResetPassword(self, sender):
            from django.contrib.auth.models import User
            usr = User.objects.get(username=sender.post_data.uid)
            usr.set_password(sender.post_data.pwd)
            usr.save()
            return {}
        def doLoadOrgs(self,model):
            from xdj_models.models import CoursewareOrgs
            return list(CoursewareOrgs().objects.all())
    @xdj.Page(url="user/reset_password", template="system/user_reset_password.html")
    class password(FormController):
        def __init__(self):
            super(type(self),self).__init__()
        def doSave(self,sender):
            pass
