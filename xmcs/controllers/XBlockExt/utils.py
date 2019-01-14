def get_block_id(txt):
    items = txt.split("@")
    return items[items.__len__()-1]
def get_course_key(txt):
    return txt
def get_course_id(txt):
    from opaque_keys.edx.keys import CourseKey
    return CourseKey.from_string(txt)
def get_usage_key(txt):
    from opaque_keys.edx.keys import UsageKey
    return UsageKey.from_string(txt)
def get_utc_now():
    from datetime import datetime
    return datetime.utcnow()
