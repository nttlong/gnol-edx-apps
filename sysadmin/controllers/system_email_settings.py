

import xdj


@xdj.controllers.Controller(
    url="system/email_settings",
    template="system/email_settings.html"
)
class SystemEmailController(xdj.BaseController):
    def on_get(self,sender):
        if isinstance(sender, xdj.Model):
            return self.render(sender)

    def on_post(self, sender):
        if isinstance(sender, xdj.Model):
            pass
        return self.render(sender)