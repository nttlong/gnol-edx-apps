angularDefine(function(mdl){


    mdl.service("$ajax",[function(){
        var instance={
            onBeforeCall:undefined,
            onAfterCall:undefined
        }
        function executor(owner,id){
            this.owner=owner;
            this._id=id;
        }
        executor.prototype.__exec=function(callback,_id,_data){
            var me=this;
            var sender=undefined;
            if(instance.onBeforeCall){
                sender=instance.onBeforeCall();
            }
            var callId=_id;
            var callData=_data;
            if(!_id){
                callId=me._id;
            }
            if(!_data){
                callData=me._data;
            }
            var $mask=$("<div class='mask'></div>").appendTo("body")
    //        callData = callData||{}
    //        callData["csrfmiddlewaretoken"]=$("[name='csrfmiddlewaretoken']").val()

            $.ajax({
                url:me.owner.url,
                method:"POST",
                headers:{
                        "AJAX-POST":callId,
                        "X-CSRFToken": me.readCookie('csrftoken')
                        },
                data:JSON.stringify(callData),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success:function(res){
                    $mask.remove();
                    if(instance.onAfterCall){
                        instance.onAfterCall(me,sender);
                    }
                    if(callback){
                        callback(undefined,res);
                    }
                },
                error:function(ex){
                    $mask.remove();
                    if(instance.onAfterCall){
                        instance.onAfterCall(me,sender);
                    }
                    var tab = window.open('about:blank', '_blank');
                    while(ex.responseText.indexOf(String.fromCharCode(10))>-1){
                        ex.responseText= ex.responseText.replace(String.fromCharCode(10),"<br/>");
                    }
                    tab.document.write(ex.responseText); // where 'html' is a variable containing your HTML
                    tab.document.close();
                    if(callback){
                        callback(ex,undefined);
                    }
                }

            });
        }
        executor.prototype.with=function(data){
            this._data=data;
            return this;
            
        }
        executor.prototype.set=function(data){
            var keys=Object.keys(data);
            if(!this._data){
                this._data=data;
            }
            for(var i=0;i<keys.length;i++){
                var key=keys[i];
                var val=data[key];
                this._data[key]=val;
            }
            return this;
        }
        executor.prototype.done=function(callback){
            var me=this;
            if(!callback){
                return new Promise(function(resolve,reject){
                    me.__exec(function(e,r){
                        if(e){
                            reject(e);
                        }
                        else {
                            resolve(r);
                        }
                    });
                });
            } else {
                return me.__exec(callback);
            }
        }
        executor.prototype.readCookie=function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
        function Caller(url){
            this.url=url;
        }
    
        
        Caller.prototype.call=function(id,data,callback){
            var ret= new executor(this,id);
            if(typeof data=="function"){
                callback=data;
                data=undefined;
            }
            if(data){
                ret.with(data);
            }
            if(callback){
                return ret.__exec(callback);
            }
            return ret;
        }
        Caller.prototype.callAll=function(){
            var promises=[];
            var _executor=new executor(this);
            var args=arguments;
            for(var i=0;i<args.length;i++){
                promises.push(new Promise(function(resole,reject){
                    var arg=args[i];
                    _executor.__exec(function(e,r){
                        if(e){
                            reject(e);
                        }
                        else {
                            if(arg.done){
                                arg.done(r);
                                resole(r);
                            }
                        }
                        
                    },arg.id,arg.data);
                }));
            }
            return Promise.all(promises);
        }
        return {
            setOnBeforeCall:function(cb){
                instance.onAfterCall=cb;
            },
            setOnAfterCall:function(cb){
                instance.onAfterCall=cb;
            },
            with:function(url){
                return new Caller(url);
            }

        }
    }])

    mdl.service("$msgError",[function(){
        var instance={
            tmp:'<div class=\"wrapper wrapper-notification wrapper-notification-error is-shown\" aria-hidden=\"false\" aria-labelledby=\"notification-error-title\" tabindex="-1" aria-describedby=\"notification-error-description\">'+
                                '<div class=\"notification error\">'+
                                    '<span class=\"feedback-symbol fa fa-warning\" aria-hidden=\"true\"></span>'+
                                    '<div class=\"copy\">'+
                                        '<h2 class=\"title title-3\" id=\"notification-error-title\"></h2>'+
                                        '<p class=\"message\" id=\"notification-error-description\">................</p>'+
                                    '</div>'+
                                '</div>'+
                        '</div>'
        }
        function error(title,msg){
            this.title=title;
            this.msg = msg;
        }
        error.prototype.show=function(callback){
            this.onShow=callback;
            return this;
        }
        error.prototype.hide=function(callback){
            this.onHide=callback;
            return this;
        }
        error.prototype.done=function(callback){
            var me=this;
            me.onDone=callback;
            var ele=$(instance.tmp).appendTo("body");
            ele.find("#notification-error-title").html(this.title);
            ele.find("#notification-error-description").html(this.msg);
                ele.on("click",function(event){
                    $(ele).removeClass("is-shown");
                    setTimeout(function(){
                        ele.remove();
                    }, 4000);    
                })
                setTimeout(function(){
                    ele.remove();
                    if(me.onDone){
                        me.onDone();
                    }
            }, 3000); 
            return this; 
        }

        return function(title,msg){
            return new error(title,msg);
        }
    }])
    mdl.directive("errorMsg",["$msgError","$compile",function($msgError,$compile){
        return {
            restrict:"ECA",
            template:"<div style='display:none'><p ng-transclude></p></div>",
            replace:true,
            transclude:true,
            link:function(scope,ele,attr){
                if(attr.msg){
                    $msgError(attr.title,scope.$eval(attr.msg)).done(function(){
                        scope.$apply();
                        scope.$eval(attr.onDone)
    
                    });
                    return;
                }
                $msgError(attr.title,$(ele[0]).html()).done(function(){
                    scope.$apply();
                    scope.$eval(attr.onDone)

                });
            }
        }

    }])
});