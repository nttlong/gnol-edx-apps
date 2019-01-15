

import xdj

@xdj.Controller(
    url="login",
    template="login.html",
    replace_url=r"^login$"
)
class LoginController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)
    def on_post(self,sender):
        if isinstance(sender, xdj.Model):
            from django.contrib.auth import authenticate, login
            user = authenticate(username=sender.post_data.username[0], password=sender.post_data.password[0])
            if user is not None:
                login(sender.request, user)
                if hasattr(sender.post_data,"next"):
                    import urllib
                    ret_url = urllib.unquote(sender.post_data.next[0])
                    if ret_url.count("course_id=")>0:
                        course_id = ret_url.split("course_id=")[1].split('&')[0]
                        return  sender.redirect("/courses/{0}/course/".format(course_id))
                    return sender.redirect(urllib.unquote(sender.post_data.next[0].split('=')[1]))
                if sender.request.GET.get("next",None) == None:
                    return sender.redirect(sender.appUrl)
                else:
                    return sender.redirect(sender.request.GET.get("next",None))
            else:
                sender.isError=True

            sender.username = sender.post_data.username[0]
        return self.render(sender)
