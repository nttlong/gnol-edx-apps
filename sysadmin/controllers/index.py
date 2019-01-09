#coding=utf-8
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import xdj


class obj(object):
    pass
def create(dict):
    ret = obj()
    ret.__dict__.update(dict)
    return ret
# from . import base
@xdj.Controller(
    url="",
    template="index.html"
)
class index(xdj.BaseController):
    """
    Trang index
    """
    def __init__(self):
        x=1
    def on_get(self,sender):
        sender.menu=[
            xdj.dobject(
                caption="Hệ thống",
                items=[

                    xdj.dobject(
                        caption="Người dùng",
                        page="system/users"

                    ),
                    xdj.dobject(
                        caption="Email",
                        page="system/email_settings"
                    )
                ]
            ),
            xdj.dobject(
                caption="Danh mục",
                items=[
                    xdj.dobject(
                        caption="Doanh nghiệp",
                        page="system/orgs"
                    ),
                    xdj.dobject(
                        caption="Lĩnh vực",
                        page="system/subjects"
                    ),
                    xdj.dobject(
                        caption="Khóa học",
                        page="couserware/courses"
                    )
                ])
        ]
        return self.render(sender)