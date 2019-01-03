!function(e,t){for(var a in t)e[a]=t[a]}(window,webpackJsonp([22],{"./lms/static/js/learner_analytics_dashboard/CircleChart.jsx":function(e,t,a){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o=a("./node_modules/react/index.js"),i=a.n(o),c=a("./node_modules/classnames/index.js"),l=(a.n(c),a("./node_modules/prop-types/index.js")),u=a.n(l),d=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),p=2*Math.PI,m=function(e){function t(e){n(this,t);var a=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.getCenter=a.getCenter.bind(a),a.getSlices=a.getSlices.bind(a),a}return s(t,e),d(t,[{key:"getCenter",value:function(){var e=this.props,t=e.centerHole,a=e.sliceBorder;if(t){return i.a.createElement("circle",{cx:50,cy:50,r:25,fill:a.strokeColor})}}},{key:"getSlices",value:function(e,t){var a=e.reduce(function(e,t){return e+t.value},0),n=t.strokeColor,r=t.strokeWidth,s=0,o=49,c=0;return e.slice(0).reverse().map(function(e,t){var l=e.value,u=e.sliceIndex;if(l===a)return i.a.createElement("circle",{r:49,cx:50,cy:50,className:"slice-1",key:t});if(0!==l){var d=l/a,m=d<=.5?0:1;s+=d*p;var f=49*Math.cos(s),h=49*Math.sin(s),y=["M 50,50","l "+o+","+-c,"a49,49","0",m+",0",f-o+","+-(h-c),"z"].join(" ");return o=f,c=h,i.a.createElement("path",{d:y,className:"slice-"+u,key:t,stroke:n,strokeWidth:r})}})}},{key:"render",value:function(){var e=this.props,t=e.slices,a=e.sliceBorder;return i.a.createElement("svg",{viewBox:"0 0 100 100"},i.a.createElement("g",{transform:"rotate(-90 50 50)"},this.getSlices(t,a)),this.getCenter())}}]),t}(i.a.Component);m.defaultProps={sliceBorder:{strokeColor:"#fff",strokeWidth:0}},m.propTypes={slices:u.a.array.isRequired,centerHole:u.a.bool,sliceBorder:u.a.object},t.a=m},"./lms/static/js/learner_analytics_dashboard/CircleChartLegend.jsx":function(e,t,a){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o=a("./node_modules/react/index.js"),i=a.n(o),c=a("./node_modules/classnames/index.js"),l=a.n(c),u=a("./node_modules/prop-types/index.js"),d=a.n(u),p=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),m=function(e){function t(e){return n(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return s(t,e),p(t,[{key:"getList",value:function(){var e=this;return this.props.data.map(function(t,a){var n=t.value,r=t.label,s=t.sliceIndex,o="swatch-"+s;return i.a.createElement("li",{className:"legend-item",key:a},i.a.createElement("div",{className:l()("color-swatch",o),"aria-hidden":"true"}),i.a.createElement("span",{className:"label"},r),i.a.createElement("span",{className:"percentage"},e.getPercentage(n)))})}},{key:"getPercentage",value:function(e){return 100*e+"%"}},{key:"renderList",value:function(){return i.a.createElement("ul",{className:"legend-list"},this.getList())}},{key:"render",value:function(){return i.a.createElement("div",{className:"legend"},this.renderList())}}]),t}(i.a.Component);m.propTypes={data:d.a.array.isRequired},t.a=m},"./lms/static/js/learner_analytics_dashboard/Discussions.jsx":function(e,t,a){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o=a("./node_modules/react/index.js"),i=a.n(o),c=a("./node_modules/classnames/index.js"),l=a.n(c),u=a("./node_modules/prop-types/index.js"),d=a.n(u),p=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),m=function(e){function t(e){return n(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return s(t,e),p(t,[{key:"getComparisons",value:function(){var e=window.experimentVariables||{},t=this.props,a=t.content_authored,n=t.profileImages,r=e.learnerAnalyticsDiscussionAverage||4,s=1,o=0;return r>a?(s=1,o=a/r):(o=1,s=r/a),i.a.createElement("div",{className:"chart-wrapper"},this.getCountChart(a,o,"You",n.medium),this.getCountChart(r,s,"Average graduate"))}},{key:"getCountChart",value:function(e,t,a){var n,r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];return n=0===t?"2px":"calc((100% - 40px) * "+t+")",i.a.createElement("div",{className:"count-chart"},i.a.createElement("div",{className:l()("chart-icon",{"fa fa-graduation-cap":!r}),style:{backgroundImage:r?"url("+r+")":"none"},"aria-hidden":"true"}),i.a.createElement("div",{className:"chart-label"},a),i.a.createElement("div",{className:"chart-display"},i.a.createElement("div",{className:"chart-bar","aria-hidden":"true",style:{width:""+n}}),i.a.createElement("span",{className:"user-count"},e)))}},{key:"render",value:function(){var e=this.props,t=(e.content_authored,e.thread_votes);return i.a.createElement("div",{className:"discussions-wrapper"},i.a.createElement("h2",{className:"group-heading"},"Discussions"),i.a.createElement("div",{className:"comparison-charts"},i.a.createElement("h3",{className:"section-heading"},"Posts, comments, and replies"),this.getComparisons()),i.a.createElement("div",{className:"post-counts"},i.a.createElement("div",{className:"votes-wrapper"},i.a.createElement("span",{className:"fa fa-plus-square-o count-icon","aria-hidden":"true"}),i.a.createElement("span",{className:"user-count"},t),i.a.createElement("p",{className:"label"},"Votes on your posts, comments, and replies"))))}}]),t}(i.a.Component);m.propTypes={content_authored:d.a.number.isRequired,thread_votes:d.a.number.isRequired},t.a=m},"./lms/static/js/learner_analytics_dashboard/DueDates.jsx":function(e,t,a){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o=a("./node_modules/react/index.js"),i=a.n(o),c=a("./node_modules/classnames/index.js"),l=(a.n(c),a("./node_modules/prop-types/index.js")),u=a.n(l),d=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),p=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],m=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],f=function(e){function t(e){return n(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return s(t,e),d(t,[{key:"getDate",value:function(e){var t=new Date(e);return p[t.getDay()]+" "+m[t.getMonth()]+" "+t.getDate()+", "+t.getFullYear()}},{key:"getLabel",value:function(e){return this.props.assignmentCounts[e]<2?e:(this.renderLabels[e]+=1,e+" "+this.renderLabels[e])}},{key:"getList",value:function(){var e=this,t=this.props,a=t.dates,n=t.assignmentCounts;return this.renderLabels=this.initLabelTracker(n),a.sort(function(e,t){return new Date(e.due)>new Date(t.due)}).map(function(t,a){var n=t.format,r=t.due;return i.a.createElement("li",{className:"date-item",key:a},i.a.createElement("div",{className:"label"},e.getLabel(n)),i.a.createElement("div",{className:"data"},e.getDate(r)))})}},{key:"initLabelTracker",value:function(e){return Object.keys(e).reduce(function(e,t){return e[t]=0,e},{})}},{key:"renderList",value:function(){return i.a.createElement("ul",{className:"date-list"},this.getList())}},{key:"render",value:function(){return i.a.createElement("div",{className:"due-dates"},this.renderList())}}]),t}(i.a.Component);f.propTypes={dates:u.a.array.isRequired}},"./lms/static/js/learner_analytics_dashboard/GradeTable.jsx":function(e,t,a){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o=a("./node_modules/react/index.js"),i=a.n(o),c=a("./node_modules/classnames/index.js"),l=(a.n(c),a("./node_modules/prop-types/index.js")),u=a.n(l),d=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),p=function(e){function t(e){return n(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return s(t,e),d(t,[{key:"getTableGroup",value:function(e,t){var a=this.props.grades,n=a.filter(function(t){if(t.assignment_type===e)return t}),r=n.length>1,s=n.map(function(e,t){var a=e.assignment_type,n=e.total_possible,s=e.total_earned,o=e.passing_grade,c=r?a+" "+(t+1):a;return i.a.createElement("tr",{key:t},i.a.createElement("td",null,c),i.a.createElement("td",null,o,"/",n),i.a.createElement("td",null,s,"/",n))});return!!s.length&&i.a.createElement("tbody",{className:"type-group",key:t},s)}},{key:"render",value:function(){var e=this,t=this.props,a=t.assignmentTypes,n=t.passingGrade,r=t.percentGrade;return i.a.createElement("table",{className:"table grade-table"},i.a.createElement("thead",{className:"table-head"},i.a.createElement("tr",null,i.a.createElement("th",null,"Assignment"),i.a.createElement("th",null,"Passing"),i.a.createElement("th",null,"You"))),a.map(function(t,a){return e.getTableGroup(t,a)}),i.a.createElement("tfoot",null,i.a.createElement("tr",{className:"totals"},i.a.createElement("td",{className:"footer-label"},"Total"),i.a.createElement("td",null,n,"%"),i.a.createElement("td",null,"*",r,"%"))))}}]),t}(i.a.Component);p.propTypes={assignmentTypes:u.a.array.isRequired,grades:u.a.array.isRequired,passingGrade:u.a.number.isRequired,percentGrade:u.a.number.isRequired},t.a=p},"./lms/static/js/learner_analytics_dashboard/LearnerAnalyticsDashboard.jsx":function(e,t,a){"use strict";function n(e){if(Array.isArray(e)){for(var t=0,a=Array(e.length);t<e.length;t++)a[t]=e[t];return a}return Array.from(e)}function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e){return e.reduce(function(e,t){var a=Object.keys(t)[0];return e[a]=t[a],e},{})}function o(e,t){var a=0;return t.map(function(t){t.format===e&&(a+=1)}),a}function i(e){return(1===e?"User":"Users")+" active in this course right now"}function c(e,t){return s(e.map(function(e){return r({},e,o(e,t))}))}function l(e){return Array.apply(null,{length:e}).map(function(e,t){return h.a.createElement("span",{className:"fa fa-trophy","aria-hidden":"true",key:t})})}function u(e){return(e>0?"Maintain":"Start")+" your active streak by"}function d(e){var t=1===e?"week":"weeks";return e>0&&"Active "+e+" "+t+" in a row"}function p(e){var t=e.grading_policy,a=e.grades,r=e.schedule,s=e.schedule_raw,o=e.week_streak,p=e.weekly_active_users,m=e.discussion_info,f=e.profile_images,y=e.passing_grade,b=e.percent_grade,w=t.GRADER.map(function(e,t){var a=e.type;return{value:e.weight,label:a,sliceIndex:t+1}}),k=w.map(function(e){return e.label}),N=[].concat(n(new Set(k)));c(N,r);return console.log(s),console.log(a),h.a.createElement("div",{className:"learner-analytics-wrapper"},h.a.createElement("div",{className:"main-block"},h.a.createElement("div",{className:"analytics-group"},h.a.createElement("h2",{className:"group-heading"},"Grading"),w&&h.a.createElement("h3",{className:"section-heading"},"Weight"),w&&h.a.createElement("div",{className:"grading-weight-wrapper"},h.a.createElement("div",{className:"chart-wrapper"},h.a.createElement(g.a,{slices:w,centerHole:!0,sliceBorder:{strokeColor:"#f5f5f5",strokeWidth:2}})),h.a.createElement(v.a,{data:w})),h.a.createElement("h3",{className:"section-heading"},"Graded Assignments"),h.a.createElement("div",{className:"graded-assessments-wrapper"},h.a.createElement(_.a,{assignmentTypes:N,grades:a,passingGrade:y,percentGrade:b}),h.a.createElement("div",{className:"footnote"},"* Your current grade is calculated based on all assignments, including those you have not yet completed."))),h.a.createElement("div",{className:"analytics-group"},h.a.createElement(E.a,j({},m,{profileImages:f})))),h.a.createElement("div",{className:"analytics-group sidebar week-streak"},h.a.createElement("h2",{className:"group-heading"},"Timing"),h.a.createElement("div",{className:"week-streak-wrapper"},h.a.createElement("h3",{className:"section-heading"},"Week streak"),o>0&&h.a.createElement("div",{className:"streak-icon-wrapper","aria-hidden":"true"},l(o)),h.a.createElement("p",null,d(o)),h.a.createElement("p",{className:"streak-encouragement"},u(o)),h.a.createElement("ul",{className:"streak-criteria"},h.a.createElement("li",null,"Answering problems"),h.a.createElement("li",null,"Participating in discussions"),h.a.createElement("li",null,"Watching course videos"))),h.a.createElement("div",{className:"active-users-wrapper"},h.a.createElement("span",{className:"fa fa-user count-icon","aria-hidden":"true"}),h.a.createElement("span",{className:"user-count"},p.toLocaleString("en",{useGrouping:!0})),h.a.createElement("p",{className:"label"},i(p)))))}Object.defineProperty(t,"__esModule",{value:!0}),t.LearnerAnalyticsDashboard=p;var m=a("./node_modules/prop-types/index.js"),f=(a.n(m),a("./node_modules/react/index.js")),h=a.n(f),y=a("./node_modules/react-dom/index.js"),b=(a.n(y),a("./node_modules/classnames/index.js")),g=(a.n(b),a("./lms/static/js/learner_analytics_dashboard/CircleChart.jsx")),v=a("./lms/static/js/learner_analytics_dashboard/CircleChartLegend.jsx"),_=a("./lms/static/js/learner_analytics_dashboard/GradeTable.jsx"),E=(a("./lms/static/js/learner_analytics_dashboard/DueDates.jsx"),a("./lms/static/js/learner_analytics_dashboard/Discussions.jsx")),j=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}}},["./lms/static/js/learner_analytics_dashboard/LearnerAnalyticsDashboard.jsx"]));