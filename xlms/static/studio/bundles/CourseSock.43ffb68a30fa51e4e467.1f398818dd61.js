!function(e,o){for(var t in o)e[t]=o[t]}(window,webpackJsonp([80],{"./openedx/features/course_experience/static/course_experience/js/CourseSock.js":function(e,o,t){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),function(e){function i(e,o){if(!(e instanceof o))throw new TypeError("Cannot call a class as a function")}t.d(o,"CourseSock",function(){return c});var c=function o(){i(this,o);var t=e(".action-toggle-verification-sock"),c=e(".verification-sock .verification-main-panel"),s=e(".verification-sock .action-upgrade-certificate"),n=e(".mini-cert"),a=window.location.href.indexOf("courseware")>-1?"Course Content Page":"Home Page",r=function(){if(s.is(":visible")){var o=e(window).scrollTop()+e(window).height(),t=c.offset().top+320,i=t+c.height()-220,a=window.outerWidth-(n.offset().left+n.width());o>t&&o<i&&e(window).width()>960?(s.addClass("attached"),s.css("right",a+"px")):(s.removeClass("attached"),s.css("right","20px"),o<t?(s.addClass("stuck-top"),s.removeClass("stuck-bottom")):o>i&&(s.addClass("stuck-bottom"),s.removeClass("stuck-top")))}};s.length&&e(window).scroll(r).resize(r),t.on("click",function(){t.toggleClass("active"),c.slideToggle(400,r);var e="false"===t.attr("aria-expanded");t.attr("aria-expanded",e);var o=t.hasClass("active"),i=o?"edx.bi.course.sock.toggle_opened":"edx.bi.course.sock.toggle_closed";window.analytics.track(i,{from_page:a})}),s.on("click",function(){Logger.log("edx.course.enrollment.upgrade.clicked",{location:"sock"})})}}.call(o,t(0))},0:function(e,o){!function(){e.exports=window.jQuery}()}},["./openedx/features/course_experience/static/course_experience/js/CourseSock.js"]));