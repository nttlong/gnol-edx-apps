var edx=edx||{};(function($,_,Backbone){"use strict";edx.verify_student=edx.verify_student||{};edx.verify_student.ErrorView=Backbone.View.extend({initialize:function(obj){var ErrorModel=Backbone.Model.extend({});this.model=obj.model||new ErrorModel({errorTitle:"",errorMsg:"",shown:false});this.listenTo(this.model,"change",this.render)},render:function(){var renderedHtml=_.template($("#error-tpl").html())({errorTitle:this.model.get("errorTitle"),errorMsg:this.model.get("errorMsg")});$(this.el).html(renderedHtml);if(this.model.get("shown")){$(this.el).show();$("html, body").animate({scrollTop:0})}else{$(this.el).hide()}}})})($,_,Backbone);var edx=edx||{};(function($,_,Backbone,gettext){"use strict";edx.verify_student=edx.verify_student||{};edx.verify_student.ImageInputView=Backbone.View.extend({template:"#image_input-tpl",initialize:function(obj){this.$submitButton=obj.submitButton?$(obj.submitButton):"";this.modelAttribute=obj.modelAttribute||"";this.errorModel=obj.errorModel||null},render:function(){var renderedHtml=_.template($(this.template).html())({});$(this.el).html(renderedHtml);this.setSubmitButtonEnabled(false);this.$input=$("input.image-upload");this.$preview=$("img.preview");this.$input.on("change",_.bind(this.handleInputChange,this));this.displayImage(false);return this},handleInputChange:function(event){var files=event.target.files,reader=new FileReader;if(files[0]&&files[0].type.match("image.[png|jpg|jpeg]")){reader.onload=_.bind(this.handleImageUpload,this);reader.onerror=_.bind(this.handleUploadError,this);reader.readAsDataURL(files[0])}else if(files.length===0){this.handleUploadError(false)}else{this.handleUploadError(true)}},handleImageUpload:function(event){var imageData=event.target.result;this.model.set(this.modelAttribute,imageData);this.displayImage(imageData);this.setSubmitButtonEnabled(true);if(this.errorModel){this.errorModel.set({shown:false})}this.trigger("imageCaptured")},displayImage:function(imageData){if(imageData){this.$preview.attr("src",imageData).removeClass("is-hidden").attr("aria-hidden","false")}else{this.$preview.attr("src","").addClass("is-hidden").attr("aria-hidden","true")}},handleUploadError:function(displayError){this.displayImage(null);this.setSubmitButtonEnabled(false);if(this.errorModel){if(displayError){this.errorModel.set({errorTitle:gettext("Image Upload Error"),errorMsg:gettext("Please verify that you have uploaded a valid image (PNG and JPEG)."),shown:true})}else{this.errorModel.set({shown:false})}}this.trigger("error")},setSubmitButtonEnabled:function(isEnabled){this.$submitButton.toggleClass("is-disabled",!isEnabled).prop("disabled",!isEnabled).attr("aria-disabled",!isEnabled)}})})(jQuery,_,Backbone,gettext);var edx=edx||{},key={enter:13};(function($,_,Backbone,gettext){"use strict";edx.verify_student=edx.verify_student||{};edx.verify_student.WebcamPhotoView=Backbone.View.extend({template:"#webcam_photo-tpl",el:"#webcam",backends:{html5:{name:"html5",initialize:function(obj){this.URL=window.URL||window.webkitURL;this.video=obj.video||"";this.canvas=obj.canvas||"";this.stream=null;var getUserMedia=this.getUserMediaFunc();if(getUserMedia){getUserMedia({video:true,fake:window.location.hostname==="localhost"},_.bind(this.getUserMediaCallback,this),_.bind(this.handleVideoFailure,this))}},isSupported:function(){return this.getUserMediaFunc()!==undefined},snapshot:function(){var video;if(this.stream){video=this.getVideo();this.getCanvas().getContext("2d").drawImage(video,0,0);video.pause();return true}return false},getImageData:function(){return this.getCanvas().toDataURL("image/png")},reset:function(){this.getVideo().play()},getUserMediaFunc:function(){var userMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;if(userMedia){return _.bind(userMedia,navigator)}},getUserMediaCallback:function(stream){var video=this.getVideo();this.stream=stream;video.srcObject=stream;video.play();this.trigger("webcam-loaded")},getVideo:function(){return $(this.video).first()[0]},getCanvas:function(){return $(this.canvas).first()[0]},handleVideoFailure:function(){this.trigger("error",gettext("Video Capture Error"),gettext("Please verify that your webcam is connected and that you have allowed your browser to access it."))}},flash:{name:"flash",initialize:function(obj){this.wrapper=obj.wrapper||"";this.imageData="";this.checkCameraSupported()},isSupported:function(){try{var flashObj=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");if(flashObj){return true}}catch(ex){if(navigator.mimeTypes["application/x-shockwave-flash"]!==undefined){return true}}return false},snapshot:function(){var flashObj=this.getFlashObject();if(flashObj.cameraAuthorized()){this.imageData=flashObj.snap();return true}return false},reset:function(){this.getFlashObject().reset()},getImageData:function(){return this.imageData},flashObjectTag:function(){return'<object type="application/x-shockwave-flash" '+'id="flash_video" '+'name="flash_video" '+'data="/static/js/verify_student/CameraCapture.swf" '+'width="500" '+'height="375">'+'<param name="quality" value="high">'+'<param name="allowscriptaccess" value="sameDomain">'+"</object>"},getFlashObject:function(){return $("#flash_video")[0]},checkCameraSupported:function(){var flashObj=this.getFlashObject(),isLoaded=false,hasCamera=false;isLoaded=flashObj&&flashObj.hasOwnProperty("percentLoaded")&&flashObj.percentLoaded()===100;hasCamera=flashObj&&flashObj.hasOwnProperty("hasCamera")&&flashObj.hasCamera();if(isLoaded&&!hasCamera){this.trigger("error",gettext("No Webcam Detected"),gettext("You don't seem to have a webcam connected.")+"  "+gettext("Double-check that your webcam is connected and working to continue."))}else if(!isLoaded&&!hasCamera){setTimeout(_.bind(this.checkCameraSupported,this),50)}}}},initialize:function(obj){this.submitButton=obj.submitButton||"";this.modelAttribute=obj.modelAttribute||"";this.errorModel=obj.errorModel||null;this.backend=this.backends[obj.backendName]||obj.backend;this.captureSoundPath=obj.captureSoundPath||"";_.extend(this.backend,Backbone.Events);this.backend.initialize({wrapper:"#camera",video:"#photo_id_video",canvas:"#photo_id_canvas"});this.listenTo(this.backend,"error",this.handleError);this.listenTo(this.backend,"webcam-loaded",this.handleWebcamLoaded)},isSupported:function(){return this.backend.isSupported()},render:function(){var renderedHtml,$resetBtn,$captureBtn;this.setSubmitButtonEnabled(false);renderedHtml=_.template($(this.template).html())({backendName:this.backend.name});$(this.el).html(renderedHtml);$resetBtn=this.$el.find("#webcam_reset_button");$captureBtn=this.$el.find("#webcam_capture_button");$resetBtn.on("click",_.bind(this.reset,this));$captureBtn.on("click",_.bind(this.capture,this));$resetBtn.on("keyup",_.bind(this.resetByEnter,this));$captureBtn.removeClass("is-hidden");$("#webcam_capture_button",this.el).removeClass("is-hidden");$("#webcam_capture_sound",this.el).attr("src",this.captureSoundPath);return this},reset:function(){this.setSubmitButtonEnabled(false);this.backend.reset();this.model.set(this.modelAttribute,"");$("#webcam_reset_button",this.el).addClass("is-hidden");$("#webcam_capture_button",this.el).removeClass("is-hidden");$(this.submitButton).attr("title","")},resetByEnter:function(event){if(event.keyCode==key.enter){this.reset()}},capture:function(){var success=this.backend.snapshot();if(success){this.trigger("imageCaptured");$("#webcam_capture_button",this.el).addClass("is-hidden");$("#webcam_reset_button",this.el).removeClass("is-hidden");this.model.set(this.modelAttribute,this.backend.getImageData());this.setSubmitButtonEnabled(true);this.setSubmitButtonFocused();this.captureSound()}},handleWebcamLoaded:function(errorTitle,errorMsg){$("#camera .placeholder-art",this.el).hide()},handleError:function(errorTitle,errorMsg){$("#webcam_capture_button",this.el).addClass("is-hidden");$("#webcam_reset_button",this.el).addClass("is-hidden");if(this.errorModel){this.errorModel.set({errorTitle:errorTitle,errorMsg:errorMsg,shown:true})}},setSubmitButtonEnabled:function(isEnabled){$(this.submitButton).toggleClass("is-disabled",!isEnabled).prop("disabled",!isEnabled).attr("aria-disabled",!isEnabled)},captureSound:function(){$("#webcam_capture_sound")[0].play()},setSubmitButtonFocused:function(){$(this.submitButton).trigger("focus").attr("title",gettext("Photo Captured successfully."))},isMobileDevice:function(){return!!navigator.userAgent.match(/(Android|iPad|iPhone|iPod)/g)}});edx.verify_student.getSupportedWebcamView=function(obj){var view=null;obj.backendName="html5";view=new edx.verify_student.WebcamPhotoView(obj);if(view.isSupported()){return view}obj.backendName="flash";view=new edx.verify_student.WebcamPhotoView(obj);if(view.isSupported()){return view}if(!view.isMobileDevice()&&!view.isSupported()){view.backend.trigger("error",gettext("No Flash Detected"),gettext("You don't seem to have Flash installed. Get Flash to continue your verification."));return view}return new edx.verify_student.ImageInputView(obj)}})(jQuery,_,Backbone,gettext);var edx=edx||{};(function($,Backbone){"use strict";edx.verify_student=edx.verify_student||{};edx.verify_student.VerificationModel=Backbone.Model.extend({defaults:{fullName:null,faceImage:"",identificationImage:null,courseKey:null,checkpoint:null},sync:function(method,model){var headers={"X-CSRFToken":$.cookie("csrftoken")},data={};data.face_image=model.get("faceImage");if(model.has("identificationImage")){data.photo_id_image=model.get("identificationImage")}if(model.has("fullName")){data.full_name=model.get("fullName");window.analytics.track("edx.bi.user.full_name.changed",{category:"verification"})}if(model.has("courseKey")&&model.has("checkpoint")){data.course_key=model.get("courseKey");data.checkpoint=model.get("checkpoint")}$.ajax({url:"/verify_student/submit-photos/",type:"POST",data:data,headers:headers,success:function(response){model.trigger("sync",response.url)},error:function(error){model.trigger("error",error)}})}})})(jQuery,Backbone);var edx=edx||{};(function($,_,_s,Backbone,gettext,HtmlUtils){"use strict";edx.verify_student=edx.verify_student||{};edx.verify_student.InCourseReverifyView=Backbone.View.extend({el:"#incourse-reverify-container",templateId:"#incourse_reverify-tpl",submitButtonId:"#submit",events:{"click #submit":"submitPhoto"},initialize:function(obj){_.mixin(_s.exports());this.errorModel=obj.errorModel||null;this.courseKey=obj.courseKey||null;this.platformName=obj.platformName||null;this.usageId=obj.usageId||null;this.model=new edx.verify_student.VerificationModel({courseKey:this.courseKey,checkpoint:this.usageId});this.listenTo(this.model,"sync",_.bind(this.handleSubmitPhotoSuccess,this));this.listenTo(this.model,"error",_.bind(this.handleSubmissionError,this))},render:function(){HtmlUtils.setHtml(this.el,HtmlUtils.template($(this.templateId).html())({courseKey:this.courseKey,platformName:this.platformName}));this.renderWebcam();return this},renderWebcam:function(){edx.verify_student.getSupportedWebcamView({el:$("#webcam"),model:this.model,modelAttribute:"faceImage",submitButton:this.submitButtonId,errorModel:this.errorModel}).render()},submitPhoto:function(){this.setSubmitButtonEnabled(false);this.model.save()},handleSubmitPhotoSuccess:function(redirect_url){window.location.href=redirect_url},handleSubmissionError:function(xhr){var errorMsg=gettext("An error has occurred. Please try again later.");this.setSubmitButtonEnabled(true);if(xhr.status===400){errorMsg=xhr.responseText}this.errorModel.set({errorTitle:gettext("Could not submit photos"),errorMsg:errorMsg,shown:true})},setSubmitButtonEnabled:function(isEnabled){$(this.submitButtonId).toggleClass("is-disabled",!isEnabled).prop("disabled",!isEnabled).attr("aria-disabled",!isEnabled)}})})(jQuery,_,_.str,Backbone,gettext,edx.HtmlUtils);var edx=edx||{};(function($,_){"use strict";var errorView,$el=$("#incourse-reverify-container");edx.verify_student=edx.verify_student||{};errorView=new edx.verify_student.ErrorView({el:$("#error-container")});return new edx.verify_student.InCourseReverifyView({courseKey:$el.data("course-key"),platformName:$el.data("platform-name"),usageId:$el.data("usage-id"),errorModel:errorView.model}).render()})(jQuery,_);
