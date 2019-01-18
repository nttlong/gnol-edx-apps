

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
            from django.contrib.auth.models import User
            import re
            match = re.match('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$', sender.post_data.username[0])
            username = sender.post_data.username[0]
            if  match != None:
                x = User.objects.filter(email=username).all()
                if x.__len__()>0:
                    username = x[0].username

            user = authenticate(username=username, password=sender.post_data.password[0])
            if user is not None:
                login(sender.request, user)
                if hasattr(sender.post_data,"next"):
                    import urllib
                    ret_url = urllib.unquote(sender.post_data.next[0])
                    if ret_url.count("course_id=")>0:
                        course_id = ret_url.split("course_id=")[1].split('&')[0]
                        return  sender.redirect("/courses/{0}/course/".format(course_id))
                    if sender.post_data.next[0].split('=').__len__()>1:
                        return sender.redirect(urllib.unquote(sender.post_data.next[0].split('=')[1]))
                    else:
                        return sender.redirect("/")
                if sender.request.GET.get("next",None) == None:
                    return sender.redirect(sender.appUrl)
                else:
                    return sender.redirect(sender.request.GET.get("next",None))
            else:
                sender.isError=True


            sender.username = sender.post_data.username[0]
        return self.render(sender)
