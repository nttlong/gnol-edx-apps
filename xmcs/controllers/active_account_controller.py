import xdj
@xdj.Controller(
    url="active_account/(?P<token>.*?)",
    template="active_account.html"
)
class ActiveCccountController(xdj.BaseController):
    def on_get(self,model):
        from xdj import pymqr,medxdb
        from django.conf import settings
        import datetime
        qr = pymqr.query(medxdb.db(),settings.COLLECTION_TOKENS)
        x =qr.new().where(pymqr.filters.token==model.params.token).object
        model.error_type = ""
        if x.is_empty():
            model.error_type="token_was_not_found"
        else:
            days = (datetime.datetime.utcnow()-x.created_on).days
            if days>1:
                model.error_type = "token_was_expired"
                qr.new().where(pymqr.filters.token==model.params.token).delete()
        return self.render(model)
    def on_post(self,model):
        from xdj import pymqr, medxdb
        from django.conf import settings
        import datetime
        qr = pymqr.query(medxdb.db(), settings.COLLECTION_TOKENS)
        x = qr.new().where(pymqr.filters.token == model.params.token).object
        from django.contrib.auth.models import User
        users = User.objects.filter(username=x.username).all()[0]
        user = User.objects.filter(username=x.username).all()[0]
        user.is_active = True
        user.save()
        qr.new().where(pymqr.filters.token == model.params.token).delete()
        return model.redirect("/")
