angularDefine(function(mdl){
    mdl.directive("qTemplate", ["$compile", function ($compile) {


        function loadUrl(url, handler) {
            var $mask = $("<div class='mask'></div>");
            $mask.appendTo("body");
            $.ajax({
                url: _appDirectiveSetRootUrl? _appDirectiveSetRootUrl + "/" + url:url,
                method: "get",
                success: function (res) {
                    $mask.remove();
                    handler(undefined, { url: url, res: res });
                },
                error: function (ex) {
                    $mask.remove();
                    var tab = window.open('about:blank', '_blank');
                    // while(ex.responseText.indexOf(String.fromCharCode(10))>-1){
                    //     ex.responseText= ex.responseText.replace(String.fromCharCode(10),"<br/>");
                    // }
                    tab.document.write(ex.responseText); // where 'html' is a variable containing your HTML
                    tab.document.close();
                    handler(ex);
                }
            })
        }
        function getScript(res) {
            var content = res.res;
            if (content.indexOf("<body>") > -1) {
                var x = content.indexOf("<body>") + "<body>".length;
                var y = content.indexOf("</body>",x);
                content = content.substring(x, y);
            }
            var ret = [];
            var i = content.indexOf("<script>");
            while (i > -1) {
                var j = content.indexOf("</script>", i);
                var script = content.substring(i + "<script>".length, j);
                ret.push(script);
                content = content.substring(0, i) + content.substring(j + "</script>".length, content.length);
                i = content.indexOf("<script>");
            }
            return {
                scripts: ret,
                content: content,
                url:res.url
            };
        }
        function compile(scope, scripts, content,url) {
            
            var subScope = scope.$new(true, scope);
            
            var $ele = $("<div>" + content + "</div>");
            subScope.$element = $ele.children();
            $compile($ele.contents())(subScope);
            subScope.$applyAsync();
    
            return {
                scope:subScope,
                run:function(){
                    if (scripts && (scripts.length > 0)) {
                        for (var i = 0; i < scripts.length; i++) {
                            try {
                            
                                var fn = Function("var ret=" + scripts[i] + ";return ret")();
                                fn(subScope);
                            }
                            catch (ex) {
                                throw ({
                                    error: ex,
                                    url: url
                                })
                                console.log(scripts[i])
                            }
                        }
                    }
                }
    
            } 
        }
        return {
            restrict: "ACE",
            link: function (scope, ele, attr) {
                attr.$observe("url", function (value) {

                    loadUrl(value, function (err, content) {
                        var ret = getScript(content);
                        var retObj = compile(scope, ret.scripts, ret.content,ret.url);
                        ele.empty();
                        retObj.scope.$element.appendTo(ele[0]);
                        function watch() {
                            if (!$.contains($("body")[0], retObj.scope.$element[0])) {
                                retObj.scope.$destroy();
                            }
                            else {
                                if(retObj.run){
                                    setTimeout(function(){
                                        retObj.run();
                                        retObj.run=undefined;
                                    },50);
                                    
                                }
                                setTimeout(watch, 500);
                            }
                        }
                        watch();
                    })
                })
            }
        }
    }]);
    mdl.service("$errorWatcher",[function(){
        function instance(){
            this.length=0;
            this.errors={}
        }
        instance.prototype.count=function(){
            var keys=Object.keys(this.errors);
            var ret=0;
            for(var i=0;i<keys.length;i++){
                if(this.errors[keys[i]]!==undefined){
                    ret++;
                }
            }
            return ret;
        }
        instance.prototype.add=function(id,msg){
            this.errors[id]={
                id:id,
                message:msg
            }
        }
        return function(){
            return new instance();
        }
    }]);
    mdl.directive("qRequire",["$parse","$errorWatcher",function($parse,$errorWatcher){
        return {
            restrict:"ECA",
            replace:true,
            transclude:true,
            template:"<div style='display:none'><span id='msg'></span></div>",
            link:function(scope,ele,attr){
                if(!mdl.$$$id){
                    mdl.$$$id=1;
                }
                else {
                    mdl.$$$id++;
                }
                var data={
                    id:attr.id||mdl.$$$id
                }
                var $errors=scope.$eval("$errors")||$errorWatcher();
                $parse("$errors").assign(scope,$errors);
                var x= scope.$eval(attr.ngModel);
                if(angular.isUndefined(x) || (n=="")){
                    data.message=ele.find("#msg").html();
                    if($errors.length>0){
                        $errors.length--;
                        $errors.errors[data.id]=undefined;
                    }
                    
                }
                scope.$watch(attr.ngModel,function(n,o){
                    var $errors=scope.$eval("$errors")||$errorWatcher();  
                    if(angular.isDefined(n) && (n!="") && (n!=o)){
                        if($errors.length>0 && $errors.errors[data.id]){
                            $errors.length--;
                            $errors.errors[data.id]=undefined;
                        }
                        
                    }
                    else {
                        
                        data.message=ele.find("#msg").html();
                        $errors.length++;
                        $errors.errors[data.id]=data;
                        
                    }
                    
                        scope.$applyAsync();
                })
            }
        }
    }]);
    mdl.directive("qRegex",["$parse","$errorWatcher",function($parse,$errorWatcher){
        return {
            restrict:"ECA",
            replace:true,
            transclude:true,
            template:"<div style='display:none'><span id='msg'></span></div>",
            link:function(scope,ele,attr){
                if(!mdl.$$$id){
                    mdl.$$$id=1;
                }
                else {
                    mdl.$$$id++;
                }
                var data={
                    id:attr.id||mdl.$$$id
                }
                  
                scope.$watch(attr.ngModel,function(n,o){
                    var $errors=scope.$eval("$errors")||$errorWatcher();
                    $parse("$errors").assign(scope,$errors);
                    if(angular.isDefined(n) && (n!="") && (n!=o)){
                        var reg = new RegExp(attr.regex);
                        var r=reg.exec(n)
                            if(r==null){
                                data.message=ele.find("#msg").html();
                                $errors.length++;
                                $errors.errors[data.id]=data;
                            }
                            else {
                                if($errors.length>0 && $errors.errors[data.id]){
                                    $errors.length--;
                                    $errors.errors[data.id]=undefined;
                                }
                                
                                
                            }
                            
                            
                            scope.$applyAsync();
                    }
                   

                })
            }
        }
    }]);
    //angular.module('imageupload', [])
    
//        ___bootstrapUI___.service("$ajax",[function(){
//        var instance={
//            onBeforeCall:undefined,
//            onAfterCall:undefined
//        }
//        function executor(owner,id){
//            this.owner=owner;
//            this._id=id;
//        }
//        executor.prototype.__exec=function(callback,_id,_data){
//            var me=this;
//            var sender=undefined;
//            if(instance.onBeforeCall){
//                sender=instance.onBeforeCall();
//            }
//            var callId=_id;
//            var callData=_data;
//            if(!_id){
//                callId=me._id;
//            }
//            if(!_data){
//                callData=me._data;
//            }
//            $.ajax({
//                url:me.owner.url,
//                method:"POST",
//                headers:{"AJAX-POST":callId},
//                data:JSON.stringify(callData),
//                contentType: "application/json; charset=utf-8",
//                dataType: "json",
//                success:function(res){
//                    if(instance.onAfterCall){
//                        instance.onAfterCall(me,sender);
//                    }
//                    if(callback){
//                        callback(undefined,res);
//                    }
//                },
//                error:function(ex){
//                    if(instance.onAfterCall){
//                        instance.onAfterCall(me,sender);
//                    }
//                    if(callback){
//                        callback(ex,undefined);
//                    }
//                }
//
//            });
//        }
//        executor.prototype.with=function(data){
//            this._data=data;
//            return this;
//
//        }
//        executor.prototype.set=function(data){
//            var keys=Object.keys(data);
//            if(!this._data){
//                this._data=data;
//            }
//            for(var i=0;i<keys.length;i++){
//                var key=keys[i];
//                var val=data[key];
//                this._data[key]=val;
//            }
//            return this;
//        }
//        executor.prototype.done=function(callback){
//            var me=this;
//            if(!callback){
//                return new Promise(function(resolve,reject){
//                    me.__exec(function(e,r){
//                        if(e){
//                            reject(e);
//                        }
//                        else {
//                            resolve(r);
//                        }
//                    });
//                });
//            } else {
//                return me.__exec(callback);
//            }
//        }
//        function Caller(url){
//            this.url=url;
//        }
//
//
//        Caller.prototype.call=function(id,data,callback){
//            var ret= new executor(this,id);
//            if(typeof data=="function"){
//                callback=data;
//                data=undefined;
//            }
//            if(data){
//                ret.with(data);
//            }
//            if(callback){
//                return ret.__exec(callback);
//            }
//            return ret;
//        }
//        Caller.prototype.callAll=function(){
//            var promises=[];
//            var _executor=new executor(this);
//            var args=arguments;
//            for(var i=0;i<args.length;i++){
//                promises.push(new Promise(function(resole,reject){
//                    var arg=args[i];
//                    _executor.__exec(function(e,r){
//                        if(e){
//                            reject(e);
//                        }
//                        else {
//                            if(arg.done){
//                                arg.done(r);
//                                resole(r);
//                            }
//                        }
//
//                    },arg.id,arg.data);
//                }));
//            }
//            return Promise.all(promises);
//        }
//        return {
//            setOnBeforeCall:function(cb){
//                instance.onAfterCall=cb;
//            },
//            setOnAfterCall:function(cb){
//                instance.onAfterCall=cb;
//            },
//            with:function(url){
//                return new Caller(url);
//            }
//
//        }
//    }])
})