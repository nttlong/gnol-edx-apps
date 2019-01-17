import xdj
@xdj.Controller(
    url="change_language",
    template="change_language.html",
    # check_url=r"^lang_pref/session_language"
)
class ChangeLanguageController(xdj.BaseController):
    def on_get(self,model):
        pass
    def on_post(self,model):
        from django.utils.translation import LANGUAGE_SESSION_KEY
        from openedx.core.djangoapps.lang_pref import COOKIE_DURATION, LANGUAGE_KEY
        from django.conf import settings
        from django.http import HttpResponse

        # model.request.session[LANGUAGE_SESSION_KEY] = "vi"
        model.request.session[LANGUAGE_SESSION_KEY] = model.post_data.language[0]
        # response.set_cookie(
        #     settings.LANGUAGE_COOKIE,
        #     language,
        #     domain=settings.SESSION_COOKIE_DOMAIN,
        #     max_age=COOKIE_DURATION
        # )
        # return None
        # from django.utils import translation
        # translation.activate(model.post_data.language[0])
        # model.request.session[translation.LANGUAGE_SESSION_KEY] = model.post_data.language[0]
        x = model.redirect(model.post_data.url[0])
        x.set_cookie(
            settings.LANGUAGE_COOKIE,
            model.post_data.language[0],
            domain=settings.SESSION_COOKIE_DOMAIN,
            max_age=COOKIE_DURATION
            )
        return x
