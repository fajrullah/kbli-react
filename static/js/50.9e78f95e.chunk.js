(window.webpackJsonp=window.webpackJsonp||[]).push([[50],{1367:function(e,t,a){"use strict";a.r(t);var n=a(100),l=a(99),c=a(101),r=a(102),o=a(103),s=a(279),i=a(0),m=a.n(i),u=a(1103),p=a(1107),h=a(1108),E=a(1249),d=a(1111),b=a(1112),g=a(1177),f=a(1250),j=a(1109),k=a(74),O=a(1215),w=a(1216),x=a(1060),N=a(110),y=a(172),v=a(124),L=a(1376),S=function(e){var t=e.label,a=e.input,n=e.meta,l=n.touched,c=n.invalid,r=n.error,o=Object(s.a)(e,["label","input","meta"]);return m.a.createElement(L.a,Object.assign({style:{width:"100%"},label:t,placeholder:t,error:l&&c,helperText:l&&r},a,o))},F=function(e){function t(){return Object(n.a)(this,t),Object(c.a)(this,Object(r.a)(t).apply(this,arguments))}return Object(o.a)(t,e),Object(l.a)(t,[{key:"componentWillMount",value:function(){this.props.checkUser()}},{key:"render",value:function(){var e=this.props.isFetching;return this.props.isAuthenticated?m.a.createElement(N.c,{to:"/dashboard"}):m.a.createElement("div",{className:"app flex-row align-items-center"},m.a.createElement(u.a,null,m.a.createElement(p.a,{className:"justify-content-center"},m.a.createElement(h.a,{md:"6"},m.a.createElement(E.a,null,m.a.createElement(d.a,{className:"p-4"},m.a.createElement(b.a,null,m.a.createElement(g.a,{onSubmit:this.props.handleSubmit},m.a.createElement("h1",null,"Login"),m.a.createElement("p",{className:"text-muted"},"Sign In to your account"),m.a.createElement(f.a,null,m.a.createElement(O.a,{name:"email",component:S,type:"text",placeholder:"Email"})),m.a.createElement(f.a,null,m.a.createElement(O.a,{name:"password",component:S,type:"password",placeholder:"Password"})),m.a.createElement(p.a,null,m.a.createElement(h.a,{xs:"6"},e?m.a.createElement("p",null,m.a.createElement("i",{className:"fa fa-spinner fa-spin"}),"..Loading"):m.a.createElement(j.a,{type:"submit",color:"light",className:"px-4"},"Login")),m.a.createElement(h.a,{xs:"6",className:"text-right"},m.a.createElement(k.Link,{to:"/register"},m.a.createElement(j.a,{color:"link",className:"px-0"},"Register")))),m.a.createElement(p.a,null,m.a.createElement(h.a,{className:"text-right"},m.a.createElement(j.a,{color:"link",className:"px-0"},"Forgot Your Password ?")))))))))))}}]),t}(i.Component);F=Object(w.a)({form:"Login"})(F),F=Object(y.b)(function(e){return{isFetching:e.isFetching,isAuthenticated:e.isAuthenticated,user:e.user,token:e.token}},function(e,t){return{onSubmit:function(t){e(Object(v.g)(t)),setTimeout(function(){e(Object(x.a)("Login"))},3e3)},checkUser:function(){var t=localStorage.getItem("token");null!==t&&e(Object(v.k)(JSON.parse(t)))}}})(F),t.default=F}}]);
//# sourceMappingURL=50.9e78f95e.chunk.js.map