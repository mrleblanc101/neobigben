import{j as m,c7 as Se,c8 as ke,bJ as Ee,c9 as Me,ca as Y,cb as se,r as x,bK as _e,cc as Oe,bh as De,cd as xe,ce as He,o as Ce,aM as Ye,aq as Ae,c5 as $e,cf as Be,cg as Ne,a as Pe,ch as Le,ci as c,cj as O,ck as P,cl as L,cm as G,cn as C,co as q,cp as M,cq as re,cr as ne,cs as T,ct as Te,cu as Re,cv as Ke,cw as We,cx as qe}from"./CfhQTK9E.js";function Je(e){var n;const a=Y(e);return(n=a==null?void 0:a.$el)!=null?n:a}const A=Se?window:void 0;function Z(...e){let n,a,s,d;if(typeof e[0]=="string"||Array.isArray(e[0])?([a,s,d]=e,n=A):[n,a,s,d]=e,!n)return ke;Array.isArray(a)||(a=[a]),Array.isArray(s)||(s=[s]);const f=[],w=()=>{f.forEach(i=>i()),f.length=0},g=(i,u,h,S)=>(i.addEventListener(u,h,S),()=>i.removeEventListener(u,h,S)),b=Ee(()=>[Je(n),Y(d)],([i,u])=>{if(w(),!i)return;const h=Me(u)?{...u}:u;f.push(...a.flatMap(S=>s.map(D=>g(i,S,D,h))))},{immediate:!0,flush:"post"}),v=()=>{b(),w()};return se(v),v}function Ie(e){return typeof e=="function"?e:typeof e=="string"?n=>n.key===e:Array.isArray(e)?n=>e.includes(n.key):()=>!0}function tt(...e){let n,a,s={};e.length===3?(n=e[0],a=e[1],s=e[2]):e.length===2?typeof e[1]=="object"?(n=!0,a=e[0],s=e[1]):(n=e[0],a=e[1]):(n=!0,a=e[0]);const{target:d=A,eventName:f="keydown",passive:w=!1,dedupe:g=!1}=s,b=Ie(n);return Z(d,f,i=>{i.repeat&&Y(g)||b(i)&&a(i)},w)}function Ue(){const e=x(!1),n=Ae();return n&&Ce(()=>{e.value=!0},n),e}function Ve(e){const n=Ue();return m(()=>(n.value,!!e()))}function R(e,n={}){const{window:a=A}=n,s=Ve(()=>a&&"matchMedia"in a&&typeof a.matchMedia=="function");let d;const f=x(!1),w=v=>{f.value=v.matches},g=()=>{d&&("removeEventListener"in d?d.removeEventListener("change",w):d.removeListener(w))},b=_e(()=>{s.value&&(g(),d=a.matchMedia(Y(e)),"addEventListener"in d?d.addEventListener("change",w):d.addListener(w),f.value=d.matches)});return se(()=>{b(),g(),d=void 0}),f}const rt={sm:640,md:768,lg:1024,xl:1280,"2xl":1536};function nt(e,n={}){function a(i,u){let h=Y(e[Y(i)]);return u!=null&&(h=Oe(h,u)),typeof h=="number"&&(h=`${h}px`),h}const{window:s=A,strategy:d="min-width"}=n;function f(i){return s?s.matchMedia(i).matches:!1}const w=i=>R(()=>`(min-width: ${a(i)})`,n),g=i=>R(()=>`(max-width: ${a(i)})`,n),b=Object.keys(e).reduce((i,u)=>(Object.defineProperty(i,u,{get:()=>d==="min-width"?w(u):g(u),enumerable:!0,configurable:!0}),i),{});function v(){const i=Object.keys(e).map(u=>[u,w(u)]);return m(()=>i.filter(([,u])=>u.value).map(([u])=>u))}return Object.assign(b,{greaterOrEqual:w,smallerOrEqual:g,greater(i){return R(()=>`(min-width: ${a(i,.1)})`,n)},smaller(i){return R(()=>`(max-width: ${a(i,-.1)})`,n)},between(i,u){return R(()=>`(min-width: ${a(i)}) and (max-width: ${a(u,-.1)})`,n)},isGreater(i){return f(`(min-width: ${a(i,.1)})`)},isGreaterOrEqual(i){return f(`(min-width: ${a(i)})`)},isSmaller(i){return f(`(max-width: ${a(i,-.1)})`)},isSmallerOrEqual(i){return f(`(max-width: ${a(i)})`)},isInBetween(i,u){return f(`(min-width: ${a(i)}) and (max-width: ${a(u,-.1)})`)},current:v,active(){const i=v();return m(()=>i.value.length===0?"":i.value.at(-1))}})}const J=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},I="__vueuse_ssr_handlers__",ze=Fe();function Fe(){return I in J||(J[I]=J[I]||{}),J[I]}function Ge(e,n){return ze[e]||n}function Qe(e){return e==null?"any":e instanceof Set?"set":e instanceof Map?"map":e instanceof Date?"date":typeof e=="boolean"?"boolean":typeof e=="string"?"string":typeof e=="object"?"object":Number.isNaN(e)?"any":"number"}const Ze={boolean:{read:e=>e==="true",write:e=>String(e)},object:{read:e=>JSON.parse(e),write:e=>JSON.stringify(e)},number:{read:e=>Number.parseFloat(e),write:e=>String(e)},any:{read:e=>e,write:e=>String(e)},string:{read:e=>e,write:e=>String(e)},map:{read:e=>new Map(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e.entries()))},set:{read:e=>new Set(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e))},date:{read:e=>new Date(e),write:e=>e.toISOString()}},ae="vueuse-storage";function Xe(e,n,a,s={}){var d;const{flush:f="pre",deep:w=!0,listenToStorageChanges:g=!0,writeDefaults:b=!0,mergeDefaults:v=!1,shallow:i,window:u=A,eventFilter:h,onError:S=l=>{console.error(l)},initOnMounted:D}=s,_=(i?De:x)(typeof n=="function"?n():n);if(!a)try{a=Ge("getDefaultStorage",()=>{var l;return(l=A)==null?void 0:l.localStorage})()}catch(l){S(l)}if(!a)return _;const k=Y(n),j=Qe(k),H=(d=s.serializer)!=null?d:Ze[j],{pause:K,resume:W}=xe(_,()=>V(_.value),{flush:f,deep:w,eventFilter:h});u&&g&&He(()=>{Z(u,"storage",$),Z(u,ae,F),D&&$()}),D||$();function B(l,y){u&&u.dispatchEvent(new CustomEvent(ae,{detail:{key:e,oldValue:l,newValue:y,storageArea:a}}))}function V(l){try{const y=a.getItem(e);if(l==null)B(y,null),a.removeItem(e);else{const E=H.write(l);y!==E&&(a.setItem(e,E),B(y,E))}}catch(y){S(y)}}function z(l){const y=l?l.newValue:a.getItem(e);if(y==null)return b&&k!=null&&a.setItem(e,H.write(k)),k;if(!l&&v){const E=H.read(y);return typeof v=="function"?v(E,k):j==="object"&&!Array.isArray(E)?{...k,...E}:E}else return typeof y!="string"?y:H.read(y)}function $(l){if(!(l&&l.storageArea!==a)){if(l&&l.key==null){_.value=k;return}if(!(l&&l.key!==e)){K();try{(l==null?void 0:l.newValue)!==H.write(_.value)&&(_.value=z(l))}catch(y){S(y)}finally{l?Ye(W):W()}}}}function F(l){$(l.detail)}return _}function Q(e,n,a={}){const{window:s=A}=a;return Xe(e,n,s==null?void 0:s.localStorage,a)}const U={toFirestore(e){return{created_at:We(),...e}},fromFirestore:qe.fromFirestore},at=$e("store",()=>{const e=Be(),n=Ne(),a=Pe(),{$moment:s}=a,{t:d}=a.$i18n,f=x(s().format("YYYY-MM-DD")),w=Q("filter",x("daily")),g=Q("selectedTabIndex",x(0)),b=Q("sort",x("creation")),v=Le(m(()=>{var t;return(t=n.value)!=null&&t.uid?c(O(e,"users"),n.value.uid):null})),i=x(!1),u=m(()=>{var t;return((t=v.value)==null?void 0:t.weekly_target)||"40:00"}),h=m(()=>s(f.value).startOf("week").format("YYYY-MM-DD")),S=m(()=>s(f.value).endOf("week").format("YYYY-MM-DD")),D=P(m(()=>n.value?L(O(e,"projects"),C("user","==",c(e,"users",n.value.uid)),G("created_at")):null),{wait:!0,ssrKey:"projects"}),_=P(m(()=>n.value?L(O(e,"bookmarks"),C("user","==",c(e,"users",n.value.uid)),G("created_at")):null),{wait:!0,ssrKey:"bookmarks"}),k=P(m(()=>v.value?L(O(e,"priorities"),C("user","==",c(e,"users",n.value.uid)),G("created_at")):null),{wait:!0,ssrKey:"priorities"}),j=P(m(()=>n.value?L(O(e,"entries"),C("user","==",c(e,"users",n.value.uid)),C("date",">=",h.value),C("date","<=",S.value)):null),{wait:!0,ssrKey:"entries"}),H=m(()=>[...j.value].sort((t,r)=>{const o=s(t.date+" "+t.start_time,"YYYY-M-D HH:mm");return s(r.date+" "+r.start_time,"YYYY-M-D HH:mm").isBefore(o)?1:-1}).filter(t=>s(f.value).isSame(t.date,"day"))),K=m(()=>{const t=Object.values(B.value).reduce((r,o)=>(r=s.duration(r).add(s.duration(o)),r),s.duration());return s.duration(t).format("HH:mm",{trim:!1})}),W=m(()=>s.duration(u.value).subtract(s.duration(K.value)).format("HH:mm",{trim:!1})),B=m(()=>j.value.filter(t=>!t.is_creating).reduce((t,r)=>{const o=s(r.date).locale("en").format("dddd").toLowerCase();return t[o]=s.duration(t[o]).add(s.duration(r.duration)).format("HH:mm",{trim:!1}),t},{sunday:"00:00",monday:"00:00",tuesday:"00:00",wednesday:"00:00",thursday:"00:00",friday:"00:00",saturday:"00:00"})),V=m(()=>{const t=[...j.value].filter(r=>!r.is_creating).reduce((r,o)=>{const p=o.project;return r[p.name]?r[p.name]=s.duration(r[p.name]).add(o.duration).format("HH:mm",{trim:!1}):r[p.name]=o.duration,r},{});return Object.entries(t).sort((r,o)=>s.duration(o[1]).asMilliseconds()-s.duration(r[1]).asMilliseconds())}),z=m(()=>{const t=[...j.value].filter(r=>!r.is_creating).filter(r=>s(r.date).isSame(f.value)).reduce((r,o)=>{const p=o.project;return r[p.name]?r[p.name]=s.duration(r[p.name]).add(o.duration).format("HH:mm",{trim:!1}):r[p.name]=o.duration,r},{});return Object.entries(t).sort((r,o)=>s.duration(o[1]).asMilliseconds()-s.duration(r[1]).asMilliseconds())}),$=m(()=>{const t=D.value.map(r=>[r,te(r)]);return b.value==="name"?t.sort((r,o)=>r[0].name.localeCompare(o[0].name)):t});async function F(t){const r=await q(O(e,"priorities").withConverter(U),{name:t,completed:!1,user:c(e,"users",n.value.uid)});await M(c(e,"users",n.value.uid),{priorities:re(r)})}async function l(t){const r=t.map(o=>c(e,"priorities",o.id));await M(c(e,"users",n.value.uid),{priorities:r})}async function y(t){await M(c(e,"priorities",t.id),{completed:!t.completed,user:c(e,"users",n.value.uid)})}async function E(t,r=!1){if(r||confirm(d("Êtes vous certain de vouloir supprimer cette priorité ?"))){const o=c(e,"priorities",t.id);await M(c(e,"users",n.value.uid),{priorities:ne(o)}),await T(o)}}function ie(){const t=k.value.filter(r=>r.completed);t.length!==0?confirm(d("Êtes vous certain de vouloir supprimer les priorités complétées ?"))&&t.forEach(r=>E(r,!0)):alert(d("Aucune priorité complétée à supprimer"))}const X=m(()=>!!j.value.find(t=>t.is_live_clocking)),ee=m(()=>!!j.value.find(t=>t.is_creating)),oe=m(()=>!X.value&&!ee.value),ue=t=>{const r=s.duration(t).asHours()===0,o=s.duration(t).asHours()===s.duration(u.value).asHours()/5,p=s.duration(t).asHours()>s.duration(u.value).asHours()/5,N=s.duration(t).asHours()>=s.duration(u.value).asHours()/5-.5;return r?"text-slate-400 dark:text-slate-600":p?"text-lime-500":o?"text-green-500":N?"text-yellow-500":"text-red-500"},te=t=>j.value.filter(r=>{var o;return((o=r==null?void 0:r.project)==null?void 0:o.id)===t.id}).length;async function ce(t){var r;await q(O(e,"entries").withConverter(U),{...t,user:c(e,"users",n.value.uid),project:(r=t.project)!=null&&r.id?c(e,"projects",t.project.id):null})}async function le(t){var r;await M(c(e,"entries",t.id),{...t,user:c(e,"users",n.value.uid),project:(r=t.project)!=null&&r.id?c(e,"projects",t.project.id):null})}async function de(t,r=!1){(r||confirm(d("Êtes vous certain de vouloir supprimer cette entrée ?")))&&await T(c(e,"entries",t.id))}async function fe(t){await M(c(e,"entries",t.id),{is_synced:!t.is_synced})}async function me(t){return{id:(await q(O(e,"projects").withConverter(U),{name:t.name,user:c(e,"users",n.value.uid)})).id,name:t.name}}async function pe(t){if(confirm(d("Êtes vous certain de vouloir supprimer ce projet ?"))){const r=c(e,"projects",t.id),{promise:o}=await P(L(O(e,"entries"),C("project","==",r)),{once:!0,wait:!0,ssrKey:"projectEntries"}),p=Te(e),N=await o.value;N.length>0?confirm(d("Cela entrainera la supression de l'entrée liée, êtes-vous certain de vouloir continuer ? | Cela entrainera la supression des {n} entrées liées, êtes-vous certain de vouloir continuer ?",N.length))&&(N.forEach(je=>{p.delete(c(e,"entries",je.id))}),await p.commit(),await T(r)):await T(r)}}async function we(t){const r=p=>(/^(?:f|ht)tps?:\/\//.test(p)||(p="https://"+p),p),o=await q(O(e,"bookmarks").withConverter(U),{...t,url:r(t.url),user:c(e,"users",n.value.uid)});await M(c(e,"users",n.value.uid),{bookmarks:re(o)})}async function ve(t){const r=t.map(o=>c(e,"bookmarks",o.id));await M(c(e,"users",n.value.uid),{bookmarks:r})}async function ye(t,r=!1){if(r||confirm(d("Êtes vous certain de vouloir supprimer ce raccourci ?"))){const o=c(e,"bookmarks",t.id);await M(c(e,"users",n.value.uid),{bookmarks:ne(o)}),await T(o)}}async function he(t){const r=c(e,"users",t.user.uid);(await Re(r)).exists()||await Ke(r,{weekly_target:"40:00"}),await M(r,{display_name:t.user.displayName,email:t.user.email,photo_url:t.user.photoURL})}async function ge(t){await M(c(e,"users",n.value.uid),{weekly_target:t})}function be(){D.value=[],k.value=[],_.value=[],j.value=[],v.value=null}return{user:v,menuOpened:i,selectedDay:f,filter:w,selectedTabIndex:g,sort:b,projects:D,entries:j,priorities:k,bookmarks:_,weekStart:h,weekEnd:S,todaysEntries:H,weekTotal:K,weekRemaining:W,weekSummary:B,weekSummaryColors:ue,weeklySummaryByProjects:V,dailySummaryByProjects:z,sortedProjects:$,projectEntriesTotal:te,isLiveClockingEntry:X,isCreatingEntry:ee,canCreateEntry:oe,addEntry:ce,updateEntry:le,deleteEntry:de,toggleEntrySynced:fe,addProject:me,deleteProject:pe,addPriority:F,reorderPriorities:l,updatePriority:y,deletePriority:E,deleteCompletedPriorities:ie,addBookmark:we,reorderBookmarks:ve,deleteBookmark:ye,createUserInfo:he,updateWeekTarget:ge,$reset:be}});export{nt as a,rt as b,tt as o,at as u};