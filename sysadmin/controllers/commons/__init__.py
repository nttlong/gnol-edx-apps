import xdj
class RequireFieldError(Exception):
    def __init__(self,fieldName):
        super(type(self),self).__init__("Please enter {0}".format(fieldName))
        self.fieldName=fieldName
        self.errorType="require"

class FormController(object):

    def check_require_field(self,data,fieldName):
        if isinstance(data,dict):
            if not data.has_key(fieldName):
                raise RequireFieldError(fieldName)
        elif not hasattr(data,fieldName):
            raise RequireFieldError(fieldName)
        return
    def check_require_fields(self,data,fieldNames):
        if isinstance(fieldNames,list):
            for item in fieldNames:
                self.check_require_field(data,item)


