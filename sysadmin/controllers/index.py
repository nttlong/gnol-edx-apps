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
        _ = sender._
        sender.menu=[
            xdj.dobject(
                caption=_>"System",
                items=[

                    xdj.dobject(
                        caption=_>"Accounts",
                        page="system/users"

                    ),
                    xdj.dobject(
                        caption=_>"Email",
                        page="system/email_settings"
                    )
                ]
            ),
            xdj.dobject(
                caption=_>"Categories",
                items=[
                    xdj.dobject(
                        caption=_>"Organization",
                        page="system/orgs"
                    ),
                    xdj.dobject(
                        caption=_>"Subject",
                        page="system/subjects"
                    ),
                    xdj.dobject(
                        caption=_>"Courses",
                        page="couserware/courses"
                    )
                ]),
            xdj.dobject(
                caption="Resources",
                items=[
                    xdj.dobject(
                        caption=_ > "Linguistics",
                        page="linguistics/list"
                    )
                ]

            ),
            xdj.dobject(
                caption="Database",
                items=[
                    xdj.dobject(
                        caption="Tables",
                        page="db/tables"
                    ),
                    xdj.dobject(
                        caption="SQL",
                        page="db/sql"
                    )
                ]
            )
        ]
        return self.render(sender)