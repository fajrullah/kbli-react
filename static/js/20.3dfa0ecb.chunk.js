(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{1086:function(e,a,t){"use strict";t.r(a);var r=t(1118),s=t(100),n=t(99),o=t(101),i=t(102),l=t(103),c=t(0),d=t.n(c),u=t(1107),m=t(1108),f=t(1111),b=t(1106),g=t(1112),p=t(1164),v=t(1172),h=function(e){function a(){return Object(s.a)(this,a),Object(o.a)(this,Object(i.a)(a).apply(this,arguments))}return Object(l.a)(a,e),Object(n.a)(a,[{key:"render",value:function(){var e=this,a=v.a.find(function(a){return a.id.toString()===e.props.match.params.id}),t=a?Object.entries(a):[["id",d.a.createElement("span",null,d.a.createElement("i",{className:"text-muted icon-ban"})," Not found")]];return d.a.createElement("div",{className:"animated fadeIn"},d.a.createElement(u.a,null,d.a.createElement(m.a,{lg:6},d.a.createElement(f.a,null,d.a.createElement(b.a,null,d.a.createElement("strong",null,d.a.createElement("i",{className:"icon-info pr-1"}),"User id: ",this.props.match.params.id)),d.a.createElement(g.a,null,d.a.createElement(p.a,{responsive:!0,striped:!0,hover:!0},d.a.createElement("tbody",null,t.map(function(e){var a=Object(r.a)(e,2),t=a[0],s=a[1];return d.a.createElement("tr",{key:t},d.a.createElement("td",null,"".concat(t,":")),d.a.createElement("td",null,d.a.createElement("strong",null,s)))}))))))))}}]),a}(c.Component);a.default=h},1104:function(e,a){e.exports=function(e){var a=typeof e;return!!e&&("object"==a||"function"==a)}},1106:function(e,a,t){"use strict";var r=t(11),s=t(25),n=t(0),o=t.n(n),i=t(1),l=t.n(i),c=t(4),d=t.n(c),u=t(9),m={tag:u.p,className:l.a.string,cssModule:l.a.object},f=function(e){var a=e.className,t=e.cssModule,n=e.tag,i=Object(s.a)(e,["className","cssModule","tag"]),l=Object(u.l)(d()(a,"card-header"),t);return o.a.createElement(n,Object(r.a)({},i,{className:l}))};f.propTypes=m,f.defaultProps={tag:"div"},a.a=f},1107:function(e,a,t){"use strict";var r=t(11),s=t(25),n=t(0),o=t.n(n),i=t(1),l=t.n(i),c=t(4),d=t.n(c),u=t(9),m={tag:u.p,noGutters:l.a.bool,className:l.a.string,cssModule:l.a.object,form:l.a.bool},f=function(e){var a=e.className,t=e.cssModule,n=e.noGutters,i=e.tag,l=e.form,c=Object(s.a)(e,["className","cssModule","noGutters","tag","form"]),m=Object(u.l)(d()(a,n?"no-gutters":null,l?"form-row":"row"),t);return o.a.createElement(i,Object(r.a)({},c,{className:m}))};f.propTypes=m,f.defaultProps={tag:"div"},a.a=f},1108:function(e,a,t){"use strict";var r=t(11),s=t(25),n=t(1104),o=t.n(n),i=t(0),l=t.n(i),c=t(1),d=t.n(c),u=t(4),m=t.n(u),f=t(9),b=d.a.oneOfType([d.a.number,d.a.string]),g=d.a.oneOfType([d.a.bool,d.a.number,d.a.string,d.a.shape({size:d.a.oneOfType([d.a.bool,d.a.number,d.a.string]),order:b,offset:b})]),p={tag:f.p,xs:g,sm:g,md:g,lg:g,xl:g,className:d.a.string,cssModule:d.a.object,widths:d.a.array},v={tag:"div",widths:["xs","sm","md","lg","xl"]},h=function(e,a,t){return!0===t||""===t?e?"col":"col-"+a:"auto"===t?e?"col-auto":"col-"+a+"-auto":e?"col-"+t:"col-"+a+"-"+t},j=function(e){var a=e.className,t=e.cssModule,n=e.widths,i=e.tag,c=Object(s.a)(e,["className","cssModule","widths","tag"]),d=[];n.forEach(function(a,r){var s=e[a];if(delete c[a],s||""===s){var n=!r;if(o()(s)){var i,l=n?"-":"-"+a+"-",u=h(n,a,s.size);d.push(Object(f.l)(m()(((i={})[u]=s.size||""===s.size,i["order"+l+s.order]=s.order||0===s.order,i["offset"+l+s.offset]=s.offset||0===s.offset,i)),t))}else{var b=h(n,a,s);d.push(b)}}}),d.length||d.push("col");var u=Object(f.l)(m()(a,d),t);return l.a.createElement(i,Object(r.a)({},c,{className:u}))};j.propTypes=p,j.defaultProps=v,a.a=j},1111:function(e,a,t){"use strict";var r=t(11),s=t(25),n=t(0),o=t.n(n),i=t(1),l=t.n(i),c=t(4),d=t.n(c),u=t(9),m={tag:u.p,inverse:l.a.bool,color:l.a.string,body:l.a.bool,outline:l.a.bool,className:l.a.string,cssModule:l.a.object,innerRef:l.a.oneOfType([l.a.object,l.a.string,l.a.func])},f=function(e){var a=e.className,t=e.cssModule,n=e.color,i=e.body,l=e.inverse,c=e.outline,m=e.tag,f=e.innerRef,b=Object(s.a)(e,["className","cssModule","color","body","inverse","outline","tag","innerRef"]),g=Object(u.l)(d()(a,"card",!!l&&"text-white",!!i&&"card-body",!!n&&(c?"border":"bg")+"-"+n),t);return o.a.createElement(m,Object(r.a)({},b,{className:g,ref:f}))};f.propTypes=m,f.defaultProps={tag:"div"},a.a=f},1112:function(e,a,t){"use strict";var r=t(11),s=t(25),n=t(0),o=t.n(n),i=t(1),l=t.n(i),c=t(4),d=t.n(c),u=t(9),m={tag:u.p,className:l.a.string,cssModule:l.a.object,innerRef:l.a.oneOfType([l.a.object,l.a.string,l.a.func])},f=function(e){var a=e.className,t=e.cssModule,n=e.innerRef,i=e.tag,l=Object(s.a)(e,["className","cssModule","innerRef","tag"]),c=Object(u.l)(d()(a,"card-body"),t);return o.a.createElement(i,Object(r.a)({},l,{className:c,ref:n}))};f.propTypes=m,f.defaultProps={tag:"div"},a.a=f},1118:function(e,a,t){"use strict";function r(e,a){return function(e){if(Array.isArray(e))return e}(e)||function(e,a){var t=[],r=!0,s=!1,n=void 0;try{for(var o,i=e[Symbol.iterator]();!(r=(o=i.next()).done)&&(t.push(o.value),!a||t.length!==a);r=!0);}catch(l){s=!0,n=l}finally{try{r||null==i.return||i.return()}finally{if(s)throw n}}return t}(e,a)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}t.d(a,"a",function(){return r})},1164:function(e,a,t){"use strict";var r=t(11),s=t(25),n=t(0),o=t.n(n),i=t(1),l=t.n(i),c=t(4),d=t.n(c),u=t(9),m={className:l.a.string,cssModule:l.a.object,size:l.a.string,bordered:l.a.bool,borderless:l.a.bool,striped:l.a.bool,dark:l.a.bool,hover:l.a.bool,responsive:l.a.oneOfType([l.a.bool,l.a.string]),tag:u.p,responsiveTag:u.p,innerRef:l.a.oneOfType([l.a.func,l.a.string,l.a.object])},f=function(e){var a=e.className,t=e.cssModule,n=e.size,i=e.bordered,l=e.borderless,c=e.striped,m=e.dark,f=e.hover,b=e.responsive,g=e.tag,p=e.responsiveTag,v=e.innerRef,h=Object(s.a)(e,["className","cssModule","size","bordered","borderless","striped","dark","hover","responsive","tag","responsiveTag","innerRef"]),j=Object(u.l)(d()(a,"table",!!n&&"table-"+n,!!i&&"table-bordered",!!l&&"table-borderless",!!c&&"table-striped",!!m&&"table-dark",!!f&&"table-hover"),t),y=o.a.createElement(g,Object(r.a)({},h,{ref:v,className:j}));if(b){var O=Object(u.l)(!0===b?"table-responsive":"table-responsive-"+b,t);return o.a.createElement(p,{className:O},y)}return y};f.propTypes=m,f.defaultProps={tag:"table",responsiveTag:"div"},a.a=f},1172:function(e,a,t){"use strict";a.a=[{id:0,name:"John Doe",registered:"2018/01/01",role:"Guest",status:"Pending"},{id:1,name:"Samppa Nori",registered:"2018/01/01",role:"Member",status:"Active"},{id:2,name:"Estavan Lykos",registered:"2018/02/01",role:"Staff",status:"Banned"},{id:3,name:"Chetan Mohamed",registered:"2018/02/01",role:"Admin",status:"Inactive"},{id:4,name:"Derick Maximinus",registered:"2018/03/01",role:"Member",status:"Pending"},{id:5,name:"Friderik D\xe1vid",registered:"2018/01/21",role:"Staff",status:"Active"},{id:6,name:"Yiorgos Avraamu",registered:"2018/01/01",role:"Member",status:"Active"},{id:7,name:"Avram Tarasios",registered:"2018/02/01",role:"Staff",status:"Banned"},{id:8,name:"Quintin Ed",registered:"2018/02/01",role:"Admin",status:"Inactive"},{id:9,name:"En\xe9as Kwadwo",registered:"2018/03/01",role:"Member",status:"Pending"},{id:10,name:"Agapetus Tade\xe1\u0161",registered:"2018/01/21",role:"Staff",status:"Active"},{id:11,name:"Carwyn Fachtna",registered:"2018/01/01",role:"Member",status:"Active"},{id:12,name:"Nehemiah Tatius",registered:"2018/02/01",role:"Staff",status:"Banned"},{id:13,name:"Ebbe Gemariah",registered:"2018/02/01",role:"Admin",status:"Inactive"},{id:14,name:"Eustorgios Amulius",registered:"2018/03/01",role:"Member",status:"Pending"},{id:15,name:"Leopold G\xe1sp\xe1r",registered:"2018/01/21",role:"Staff",status:"Active"},{id:16,name:"Pompeius Ren\xe9",registered:"2018/01/01",role:"Member",status:"Active"},{id:17,name:"Pa\u0109jo Jadon",registered:"2018/02/01",role:"Staff",status:"Banned"},{id:18,name:"Micheal Mercurius",registered:"2018/02/01",role:"Admin",status:"Inactive"},{id:19,name:"Ganesha Dubhghall",registered:"2018/03/01",role:"Member",status:"Pending"},{id:20,name:"Hiroto \u0160imun",registered:"2018/01/21",role:"Staff",status:"Active"},{id:21,name:"Vishnu Serghei",registered:"2018/01/01",role:"Member",status:"Active"},{id:22,name:"Zbyn\u011bk Phoibos",registered:"2018/02/01",role:"Staff",status:"Banned"},{id:23,name:"Einar Randall",registered:"2018/02/01",role:"Admin",status:"Inactive"},{id:24,name:"F\xe9lix Troels",registered:"2018/03/21",role:"Staff",status:"Active"},{id:25,name:"Aulus Agmundr",registered:"2018/01/01",role:"Member",status:"Pending"},{id:42,name:"Ford Prefex",registered:"2001/05/21",role:"Alien",status:"Don't panic!"}]}}]);
//# sourceMappingURL=20.3dfa0ecb.chunk.js.map