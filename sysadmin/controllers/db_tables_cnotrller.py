import xdj
@xdj.Controller(
    url="db/tables",
    template="db/tables.html"
)
class DbTablesController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)
    def DoLoadItems(self,model):
        from django.db import connection
        tables = connection.introspection.table_names()
        seen_models = connection.introspection.installed_models(tables)
        return sorted(list(set([x._meta.db_table for x in  seen_models])))