import xdj
@xdj.Controller(
    url="db/sql",
    template="db/sql.html"
)
class DbSQLController(xdj.BaseController):
    def on_get(self,model):
        return self.render(model)
    def DoExecSql(self,model):
        from django.db.utils import ProgrammingError,OperationalError,DatabaseError
        try:
            from django.db import connection
            cursor = connection.cursor()
            ret = cursor.execute(model.post_data.sql.replace("\n"," "))
            return ret
        except ProgrammingError as ex:
            return dict(
                errord=list(ex.args)
            )
        except OperationalError as ex:
            return dict(
                errord=list(ex.args)
            )
        except DatabaseError as ex:
            return dict(
                errord=list(ex.args)
            )
        except Exception as ex:
            if ex.__dict__!={}:
                return ex.__dict__
            return dict(
                error=ex.message
            )
