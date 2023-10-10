import{u as w,d as N,c as y,h as P,r as _,o as q,a as A,b as R,e as B,f as z,g as S,i as E,p as I,j as T,w as j,k as L,l as C,n as U,_ as V,m as H,q as M,s as O,t as p,v as x,x as $,y as F,z as D,A as G,B as Q}from"./entry.a3794ae4.js";async function k(t,a=w()){const{path:c,matched:e}=a.resolve(t);if(!e.length||(a._routePreloaded||(a._routePreloaded=new Set),a._routePreloaded.has(c)))return;const n=a._preloadPromises=a._preloadPromises||[];if(n.length>4)return Promise.all(n).then(()=>k(t,a));a._routePreloaded.add(c);const s=e.map(r=>{var l;return(l=r.components)==null?void 0:l.default}).filter(r=>typeof r=="function");for(const r of s){const l=Promise.resolve(r()).catch(()=>{}).finally(()=>n.splice(n.indexOf(l)));n.push(l)}await Promise.all(n)}const X=(...t)=>t.find(a=>a!==void 0),J="noopener noreferrer";/*! @__NO_SIDE_EFFECTS__ */function K(t){const a=t.componentName||"NuxtLink",c=(e,n)=>{if(!e||t.trailingSlash!=="append"&&t.trailingSlash!=="remove")return e;const s=t.trailingSlash==="append"?j:L;if(typeof e=="string")return s(e,!0);const r="path"in e?e.path:n(e).path;return{...e,name:void 0,path:s(r,!0)}};return N({name:a,props:{to:{type:[String,Object],default:void 0,required:!1},href:{type:[String,Object],default:void 0,required:!1},target:{type:String,default:void 0,required:!1},rel:{type:String,default:void 0,required:!1},noRel:{type:Boolean,default:void 0,required:!1},prefetch:{type:Boolean,default:void 0,required:!1},noPrefetch:{type:Boolean,default:void 0,required:!1},activeClass:{type:String,default:void 0,required:!1},exactActiveClass:{type:String,default:void 0,required:!1},prefetchedClass:{type:String,default:void 0,required:!1},replace:{type:Boolean,default:void 0,required:!1},ariaCurrentValue:{type:String,default:void 0,required:!1},external:{type:Boolean,default:void 0,required:!1},custom:{type:Boolean,default:void 0,required:!1}},setup(e,{slots:n}){const s=w(),r=y(()=>{const o=e.to||e.href||"";return c(o,s.resolve)}),l=y(()=>e.external||e.target&&e.target!=="_self"?!0:typeof r.value=="object"?!1:r.value===""||P(r.value,{acceptRelative:!0})),h=_(!1),d=_(null),b=o=>{var f;d.value=e.custom?(f=o==null?void 0:o.$el)==null?void 0:f.nextElementSibling:o==null?void 0:o.$el};if(e.prefetch!==!1&&e.noPrefetch!==!0&&e.target!=="_blank"&&!Z()){const f=C();let v,i=null;q(()=>{const g=Y();A(()=>{v=R(()=>{var m;(m=d==null?void 0:d.value)!=null&&m.tagName&&(i=g.observe(d.value,async()=>{i==null||i(),i=null;const u=typeof r.value=="string"?r.value:s.resolve(r.value).fullPath;await Promise.all([f.hooks.callHook("link:prefetch",u).catch(()=>{}),!l.value&&k(r.value,s).catch(()=>{})]),h.value=!0}))})})}),B(()=>{v&&z(v),i==null||i(),i=null})}return()=>{var g,m;if(!l.value){const u={ref:b,to:r.value,activeClass:e.activeClass||t.activeClass,exactActiveClass:e.exactActiveClass||t.exactActiveClass,replace:e.replace,ariaCurrentValue:e.ariaCurrentValue,custom:e.custom};return e.custom||(h.value&&(u.class=e.prefetchedClass||t.prefetchedClass),u.rel=e.rel),S(E("RouterLink"),u,n.default)}const o=typeof r.value=="object"?((g=s.resolve(r.value))==null?void 0:g.href)??null:r.value||null,f=e.target||null,v=e.noRel?null:X(e.rel,t.externalRelAttribute,o?J:"")||null,i=()=>U(o,{replace:e.replace});return e.custom?n.default?n.default({href:o,navigate:i,get route(){if(!o)return;const u=I(o);return{path:u.pathname,fullPath:u.pathname,get query(){return T(u.search)},hash:u.hash,params:{},name:void 0,matched:[],redirectedFrom:void 0,meta:{},href:o}},rel:v,target:f,isExternal:l.value,isActive:!1,isExactActive:!1}):null:S("a",{ref:d,href:o,rel:v,target:f},(m=n.default)==null?void 0:m.call(n))}}})}const W=K({componentName:"NuxtLink"});function Y(){const t=C();if(t._observer)return t._observer;let a=null;const c=new Map,e=(s,r)=>(a||(a=new IntersectionObserver(l=>{for(const h of l){const d=c.get(h.target);(h.isIntersecting||h.intersectionRatio>0)&&d&&d()}})),c.set(s,r),a.observe(s),()=>{c.delete(s),a.unobserve(s),c.size===0&&(a.disconnect(),a=null)});return t._observer={observe:e}}function Z(){const t=navigator.connection;return!!(t&&(t.saveData||/2g/.test(t.effectiveType)))}const ee=t=>(G("data-v-8e38b8ef"),t=t(),Q(),t),te={class:"font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden"},ae=ee(()=>p("div",{class:"fixed left-0 right-0 spotlight z-10"},null,-1)),re={class:"max-w-520px text-center z-20"},ne=["textContent"],oe=["textContent"],se={class:"w-full flex items-center justify-center"},le={__name:"error-404",props:{appName:{type:String,default:"Nuxt"},version:{type:String,default:""},statusCode:{type:Number,default:404},statusMessage:{type:String,default:"Not Found"},description:{type:String,default:"Sorry, the page you are looking for could not be found."},backHome:{type:String,default:"Go back home"}},setup(t){const a=t;return H({title:`${a.statusCode} - ${a.statusMessage} | ${a.appName}`,script:[],style:[{children:'*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e0e0e0}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}a{color:inherit;text-decoration:inherit}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";line-height:1.5}h1,p{margin:0}h1{font-size:inherit;font-weight:inherit}'}]}),(c,e)=>{const n=W;return M(),O("div",te,[ae,p("div",re,[p("h1",{class:"text-8xl sm:text-10xl font-medium mb-8",textContent:x(t.statusCode)},null,8,ne),p("p",{class:"text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight",textContent:x(t.description)},null,8,oe),p("div",se,[$(n,{to:"/",class:"gradient-border text-md sm:text-xl py-2 px-4 sm:py-3 sm:px-6 cursor-pointer"},{default:F(()=>[D(x(t.backHome),1)]),_:1})])])])}}},ce=V(le,[["__scopeId","data-v-8e38b8ef"],["__file","error-404.vue"]]);export{ce as default};
