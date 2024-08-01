import{u as S,d as I,r as C,a as z,o as T,b as U,c as V,e as P,f as H,g as O,h as N,i as R,p as D,n as $,j as x,k as j,l as F,m as M,q as G,w as Q,s as W,_ as J,t as A,v as K,x as X,y as _,z as k,A as Y,B as Z,C as ee,D as te,E as ae}from"./S9EjZaWQ.js";async function L(t,n=S()){const{path:r,matched:f}=n.resolve(t);if(!f.length||(n._routePreloaded||(n._routePreloaded=new Set),n._routePreloaded.has(r)))return;const e=n._preloadPromises=n._preloadPromises||[];if(e.length>4)return Promise.all(e).then(()=>L(t,n));n._routePreloaded.add(r);const a=f.map(i=>{var o;return(o=i.components)==null?void 0:o.default}).filter(i=>typeof i=="function");for(const i of a){const o=Promise.resolve(i()).catch(()=>{}).finally(()=>e.splice(e.indexOf(o)));e.push(o)}await Promise.all(e)}const ne=(...t)=>t.find(n=>n!==void 0);function re(t){const n=t.componentName||"NuxtLink";function r(e,a){if(!e||t.trailingSlash!=="append"&&t.trailingSlash!=="remove")return e;if(typeof e=="string")return q(e,t.trailingSlash);const i="path"in e&&e.path!==void 0?e.path:a(e).path;return{...e,name:void 0,path:q(i,t.trailingSlash)}}function f(e){const a=S(),i=G(),o=x(()=>!!e.target&&e.target!=="_self"),c=x(()=>{const d=e.to||e.href||"";return typeof d=="string"&&j(d,{acceptRelative:!0})}),b=R("RouterLink"),p=b&&typeof b!="string"?b.useLink:void 0,v=x(()=>{if(e.external)return!0;const d=e.to||e.href||"";return typeof d=="object"?!1:d===""||c.value}),l=x(()=>{const d=e.to||e.href||"";return v.value?d:r(d,a.resolve)}),h=v.value||p==null?void 0:p({...e,to:l}),g=x(()=>{var d;if(!l.value||c.value)return l.value;if(v.value){const u=typeof l.value=="object"&&"path"in l.value?P(l.value):l.value,m=typeof u=="object"?a.resolve(u).href:u;return r(m,a.resolve)}return typeof l.value=="object"?((d=a.resolve(l.value))==null?void 0:d.href)??null:r(F(i.app.baseURL,l.value),a.resolve)});return{to:l,hasTarget:o,isAbsoluteUrl:c,isExternal:v,href:g,isActive:(h==null?void 0:h.isActive)??x(()=>l.value===a.currentRoute.value.path),isExactActive:(h==null?void 0:h.isExactActive)??x(()=>l.value===a.currentRoute.value.path),route:(h==null?void 0:h.route)??x(()=>a.resolve(l.value)),async navigate(){await M(g.value,{replace:e.replace,external:v.value||o.value})}}}return I({name:n,props:{to:{type:[String,Object],default:void 0,required:!1},href:{type:[String,Object],default:void 0,required:!1},target:{type:String,default:void 0,required:!1},rel:{type:String,default:void 0,required:!1},noRel:{type:Boolean,default:void 0,required:!1},prefetch:{type:Boolean,default:void 0,required:!1},noPrefetch:{type:Boolean,default:void 0,required:!1},activeClass:{type:String,default:void 0,required:!1},exactActiveClass:{type:String,default:void 0,required:!1},prefetchedClass:{type:String,default:void 0,required:!1},replace:{type:Boolean,default:void 0,required:!1},ariaCurrentValue:{type:String,default:void 0,required:!1},external:{type:Boolean,default:void 0,required:!1},custom:{type:Boolean,default:void 0,required:!1}},useLink:f,setup(e,{slots:a}){const i=S(),{to:o,href:c,navigate:b,isExternal:p,hasTarget:v,isAbsoluteUrl:l}=f(e),h=C(!1),g=C(null),d=u=>{var m;g.value=e.custom?(m=u==null?void 0:u.$el)==null?void 0:m.nextElementSibling:u==null?void 0:u.$el};if(e.prefetch!==!1&&e.noPrefetch!==!0&&e.target!=="_blank"&&!ie()){const m=z();let y,s=null;T(()=>{const B=se();U(()=>{y=V(()=>{var w;(w=g==null?void 0:g.value)!=null&&w.tagName&&(s=B.observe(g.value,async()=>{s==null||s(),s=null;const E=typeof o.value=="string"?o.value:p.value?P(o.value):i.resolve(o.value).fullPath;await Promise.all([m.hooks.callHook("link:prefetch",E).catch(()=>{}),!p.value&&!v.value&&L(o.value,i).catch(()=>{})]),h.value=!0}))})})}),H(()=>{y&&O(y),s==null||s(),s=null})}return()=>{var y;if(!p.value&&!v.value){const s={ref:d,to:o.value,activeClass:e.activeClass||t.activeClass,exactActiveClass:e.exactActiveClass||t.exactActiveClass,replace:e.replace,ariaCurrentValue:e.ariaCurrentValue,custom:e.custom};return e.custom||(h.value&&(s.class=e.prefetchedClass||t.prefetchedClass),s.rel=e.rel||void 0),N(R("RouterLink"),s,a.default)}const u=e.target||null,m=ne(e.noRel?"":e.rel,t.externalRelAttribute,l.value||v.value?"noopener noreferrer":"")||null;return e.custom?a.default?a.default({href:c.value,navigate:b,get route(){if(!c.value)return;const s=new URL(c.value,window.location.href);return{path:s.pathname,fullPath:s.pathname,get query(){return D(s.search)},hash:s.hash,params:{},name:void 0,matched:[],redirectedFrom:void 0,meta:{},href:c.value}},rel:m,target:u,isExternal:p.value||v.value,isActive:!1,isExactActive:!1}):null:N("a",{ref:g,href:c.value||null,rel:m,target:u},(y=a.default)==null?void 0:y.call(a))}}})}const oe=re($);function q(t,n){const r=n==="append"?Q:W;return j(t)&&!t.startsWith("http")?t:r(t,!0)}function se(){const t=z();if(t._observer)return t._observer;let n=null;const r=new Map,f=(a,i)=>(n||(n=new IntersectionObserver(o=>{for(const c of o){const b=r.get(c.target);(c.isIntersecting||c.intersectionRatio>0)&&b&&b()}})),r.set(a,i),n.observe(a),()=>{r.delete(a),n.unobserve(a),r.size===0&&(n.disconnect(),n=null)});return t._observer={observe:f}}function ie(){const t=navigator.connection;return!!(t&&(t.saveData||/2g/.test(t.effectiveType)))}const le={__name:"error-404",props:{appName:{type:String,default:"Nuxt"},version:{type:String,default:""},statusCode:{type:Number,default:404},statusMessage:{type:String,default:"Not Found"},description:{type:String,default:"Sorry, the page you are looking for could not be found."},backHome:{type:String,default:"Go back home"}},setup(t,{expose:n}){n();const r=t;A({title:`${r.statusCode} - ${r.statusMessage} | ${r.appName}`,script:[],style:[{children:'*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:var(--un-default-border-color, #e5e7eb)}:before,:after{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}h1{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}h1,p{margin:0}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }'}]});const f={props:r,get useHead(){return A}};return Object.defineProperty(f,"__isScriptSetup",{enumerable:!1,value:!0}),f}},ue=t=>(te("data-v-c6c1efc1"),t=t(),ae(),t),ce={class:"font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden"},de=ue(()=>_("div",{class:"fixed left-0 right-0 spotlight z-10"},null,-1)),fe={class:"max-w-520px text-center z-20"},he=["textContent"],ve=["textContent"],pe={class:"w-full flex items-center justify-center"};function ge(t,n,r,f,e,a){const i=oe;return K(),X("div",ce,[de,_("div",fe,[_("h1",{class:"text-8xl sm:text-10xl font-medium mb-8",textContent:k(r.statusCode)},null,8,he),_("p",{class:"text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight",textContent:k(r.description)},null,8,ve),_("div",pe,[Y(i,{to:"/",class:"gradient-border text-md sm:text-xl py-2 px-4 sm:py-3 sm:px-6 cursor-pointer"},{default:Z(()=>[ee(k(r.backHome),1)]),_:1})])])])}const be=J(le,[["render",ge],["__scopeId","data-v-c6c1efc1"],["__file","error-404.vue"]]);export{be as default};
