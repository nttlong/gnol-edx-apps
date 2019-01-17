import xdj
@xdj.Controller(
    url="linguistics/list",
    template="linguistics/list.html"
)
class LinguisticsListController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)
    def DoLoadItems(self,model):
        from django.conf import settings
        from xdj import pymqr, medxdb
        import re
        qr = pymqr.query(medxdb.db(), settings.COLLECTION_LANGUAGE)
        if model.post_data.__dict__.has_key("search"):
            qr.pipeline.append({"$match": {"value": re.compile(model.post_data.search,re.IGNORECASE)}})
        ret = qr.get_page(100,0)
        return ret
        pass
    @xdj.Page(
        template="linguistics/editor.html",
        url="editor"
    )
    class editor(object):
        def DoLoadItem(self,model):
            from django.conf import settings
            from xdj import pymqr, medxdb
            from bson import ObjectId
            qr = pymqr.query(medxdb.db(), settings.COLLECTION_LANGUAGE)
            x = qr.new().where(pymqr.filters._id == ObjectId(model.post_data.id)).object
            return x
        def DoSaveItem(self,model):
            from django.conf import settings
            from xdj import pymqr, medxdb,clear_language_cache
            from bson import ObjectId
            qr = pymqr.query(medxdb.db(), settings.COLLECTION_LANGUAGE)
            x= qr.new().where(pymqr.filters._id == ObjectId(model.post_data._id))
            x.set(value = model.post_data.value)
            x.commit()
            clear_language_cache()
            return model.post_data