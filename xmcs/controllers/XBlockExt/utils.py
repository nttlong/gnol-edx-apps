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
def create_object_if_not_exist(data,user,course_key,parent_id=None):
    if data["block_type"] == "chapter":
        from xdj_models.models import Chapter
        if Chapter().objects.filter(chapter_id=data["block_id"]).count() == 0:
            chapter = Chapter().objects.create(chapter_id = data["block_id"])
            chapter.display_name = data["fields"]["display_name"]
            chapter.course_id = course_key
            chapter.creator = user
            chapter.created_on = get_utc_now()
            chapter.save()
        else:
            chapter = Chapter().objects.get(chapter_id=data["block_id"])
            chapter.display_name = data["fields"]["display_name"]
            chapter.modifier =user
            chapter.modified_on=get_utc_now()
            chapter.save()
    elif data["block_type"]=="sequential":
        if parent_id == None:
            raise Exception("parent_id can not be None")
        from xdj_models.models import Sequential
        if Sequential().objects.filter(sequential_id=data["block_id"]).count() == 0:
            sequential = Sequential().objects.create(sequential_id = data["block_id"])
            sequential.display_name = data["fields"]["display_name"]
            sequential.course_id = course_key
            sequential.chapter_id = parent_id
            sequential.creator = user
            sequential.created_on = get_utc_now()
            sequential.save()
        else:
            sequential = Sequential().objects.get(sequential_id=data["block_id"])
            sequential.display_name = data["fields"]["display_name"]
            sequential.modifier = user
            sequential.modified_on = get_utc_now()
            sequential.save()
    elif data["block_type"] == "vertical":
        if parent_id == None:
            raise Exception("parent_id can not be None")
        from xdj_models.models import Vertical
        if Vertical().objects.filter(vertical_id=data["block_id"]).count() == 0:
            vertical = Vertical().objects.create(vertical_id = data["block_id"])
            vertical.creator = user
            vertical.course_id = course_key
            vertical.display_name = data["fields"]["display_name"]
            vertical.created_on = get_utc_now()
            vertical.sequential_id = parent_id
            vertical.save()
        else:
            vertical = Vertical().objects.get(vertical_id=data["block_id"])
            vertical.display_name = data["fields"]["display_name"]
            vertical.modifier = user
            vertical.modified_on = get_utc_now()
            vertical.save()
    else:
        if parent_id == None:
            raise Exception("parent_id can not be None")
        from xdj_models.models import XBlock
        if XBlock().objects.filter(xblock_id=data["block_id"]).count() == 0:
            xblock = XBlock().objects.create(xblock_id =  data["block_id"])
            xblock.creator = user
            xblock.course_id = course_key
            xblock.display_name = data["fields"].get("display_name",data["block_type"])
            xblock.created_on = get_utc_now()
            xblock.xblock_type = data["block_type"]
            xblock.vertical_id = parent_id
            xblock.save()
        else:
            xblock = XBlock().objects.get(xblock_id=data["block_id"])
            xblock.display_name = data["fields"]["display_name"]
            xblock.xblock_type = data["block_type"]
            xblock.modifier = user
            xblock.modified_on = get_utc_now()
            xblock.save()


def find_parent_from_mongodb(blok_id):
    from xdj import medxdb
    coll = medxdb.db().get_collection("modulestore.structures")
    x=coll.aggregate([
        {
            "$unwind": "$blocks"
        }, {
            "$unwind": "$blocks.fields"
        }, {
            "$unwind": "$blocks.fields.children"
        }
        , {
            "$match": {
                "blocks.fields.children": blok_id
            }
        },{
            "$replaceRoot": {"newRoot": "$blocks"}
        },{
            "$sort": {"edit_info.edited_on":-1}
        }, {
            "$limit": 1
        }
    ],cursor={})
    ret= list(x)
    if ret.__len__()>0:
        return ret[0]
def find_from_mongodb(block_id):
    from xdj import medxdb
    coll = medxdb.db().get_collection("modulestore.structures")
    x=coll.aggregate([
        {
            "$unwind": "$blocks"
        },
        {
            "$match": {"blocks.block_id": block_id}
        }, {
            "$sort": {"blocks.edit_info.edited_on": -1}
        }, {
            "$limit": 1
        }, {
            "$replaceRoot": {"newRoot": "$blocks"}
        }
    ],cursor={})
    ret= list(x)
    if ret.__len__()>0:
        return ret[0]
