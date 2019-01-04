# coding = utf-8
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import xdj

@xdj.Controller(
    url="users/profile",
    template="users/profile.html"
)
class UserProfileController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)