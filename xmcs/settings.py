app_name = "xcms"
host_dir ="cms"
rel_login_url="login"
def on_authenticate(model):
    return True
def on_get_language_resource_item(language,appname,view,key,value):
    from xdj import languages
    return languages.get_item(language, appname, view, key, value)