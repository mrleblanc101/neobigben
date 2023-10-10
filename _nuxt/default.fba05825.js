import{_ as Y}from"./Logo.df4af898.js";import{u as z,I as E,_ as W,b as G}from"./hamburger.0616a9b7.js";import{q as n,s,t as e,d as v,a2 as j,a3 as T,C as U,r as $,U as A,X as D,P as h,y as Z,E as O,v as L,D as t,G as I,x as p,L as b,M as q,K as F,H as M,$ as N,_ as m,a4 as J,c as K,z as k,o as Q,a5 as X,N as V,a6 as e1,J as S,Q as t1}from"./entry.a3794ae4.js";import{u as R}from"./auth.4ca479d4.js";const o1={viewBox:"0 0 69 69",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"},n1=e("g",{id:"save_svg__Page-1","stroke-width":"1","fill-rule":"evenodd"},[e("g",{id:"save_svg__np_save_4035705_000000","fill-rule":"nonzero"},[e("path",{d:"M66.72182,15.6248 L51.56272,1.8438 C50.27792,0.6719 48.53772,0.0079 46.7159,0 L6.875,0 C3.07659,0 0,2.7969 0,6.25 L0,62.5 C0,64.1562 0.726176,65.7461 2.0152,66.918 C3.304224,68.0899 5.05307,68.75 6.875,68.75 L61.875,68.75 C63.69682,68.75 65.44571,68.08984 66.7348,66.918 C68.02389,65.74616 68.75,64.1563 68.75,62.5 L68.75,20.031 C68.7414068,18.3748 68.010932,16.7927 66.72182,15.6248 L66.72182,15.6248 Z M24.06272,6.2498 L44.68772,6.2498 L44.68772,18.7498 L24.06272,18.7498 L24.06272,6.2498 Z M20.62522,62.4998 L20.62522,40.6248 L48.12522,40.6248 L48.12522,62.4998 L20.62522,62.4998 Z M55.00022,62.5 L55.00022,40.6248 C55.00022,38.9686 54.274044,37.3787 52.98502,36.2068 C51.695996,35.0349 49.94715,34.3748 48.12522,34.3748 L20.62522,34.3748 C16.82681,34.3748 13.75022,37.1717 13.75022,40.6248 L13.75022,62.5 L6.87522,62.5 L6.87522,6.2498 L17.18772,6.2498 L17.18772,18.7498 C17.18772,20.406 17.913896,21.9959 19.20292,23.1678 C20.491944,24.3397 22.24079,24.9998 24.06272,24.9998 L44.68772,24.9998 C46.50954,24.9998 48.25843,24.33964 49.54752,23.1678 C50.83661,21.99596 51.56272,20.4061 51.56272,18.7498 L51.56272,10.656 L61.87522,20.031 L61.87522,62.5 L55.00022,62.5 Z",id:"save_svg__Shape"})])],-1),s1=[n1];function r1(d,o){return n(),s("svg",o1,s1)}const a1={render:r1},i1={key:0,class:"absolute right-0 top-full flex w-64 min-w-full translate-y-2 flex-col gap-6 rounded border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"},l1={class:"flex flex-col gap-2"},c1={class:"flex items-end justify-between border-b pb-2 dark:border-gray-800"},d1={class:"text-xs font-bold uppercase opacity-80"},u1={key:0,class:"mt-1 block text-3xl font-bold tabular-nums"},_1={class:"flex flex-col gap-2"},p1={class:"text-xs font-bold uppercase group-first:opacity-70 group-last:opacity-70 group-first:dark:opacity-30 group-last:dark:opacity-30"},L1={class:"mt-2 flex items-end justify-between gap-8 border-t pt-2 dark:border-gray-800"},C1={class:"font-bold uppercase"},g1={class:"font-bold tabular-nums"},f1=v({__name:"WeekSummary",props:{is_open:{type:Boolean,default:!1}},emits:["update:is_open"],setup(d,{emit:o}){R(),j();const i=z(),r=T(),{weekSummaryColors:u}=i,{weekSummary:l,weekObjective:a,weekTotal:_}=U(i),C=$(!1),c=$(a.value);A(()=>r.name,()=>{o("update:is_open",!1)});function w(){C.value=!1,a.value=c.value}function x(){o("update:is_open",!1)}return(f,g)=>{const H=W,P=D("on-click-outside");return n(),h(N,{"enter-active-class":"transition transform origin-top-right ease-out duration-200","enter-from-class":"opacity-0 scale-95","enter-to-class":"opacity-100 scale-100","leave-active-class":"transition transform origin-top-right ease-in duration-200","leave-from-class":"opacity-100 scale-100","leave-to-class":"opacity-0 scale-95"},{default:Z(()=>[f.is_open?O((n(),s("div",i1,[e("div",l1,[e("div",c1,[e("div",null,[e("div",d1,L(f.$t("Mon objectif")),1),t(C)?(n(),h(H,{key:1,class:"mt-1",modelValue:t(c),"onUpdate:modelValue":g[0]||(g[0]=y=>I(c)?c.value=y:null),mask:"99:99"},null,8,["modelValue"])):(n(),s("div",u1,L(t(a)),1))]),t(C)?(n(),s("button",{key:1,type:"button",class:"inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 dark:text-gray-800 dark:ring-gray-600",onClick:w},[p(t(a1),{class:"h-5"})])):(n(),s("button",{key:0,type:"button",class:"inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 dark:text-gray-800 dark:ring-gray-600",onClick:g[1]||(g[1]=y=>C.value=!0)},[p(t(E),{class:"h-5"})]))]),e("div",_1,[(n(!0),s(b,null,q(Object.values(t(l)),(y,B)=>(n(),s("div",{key:B,class:"group flex items-end justify-between gap-8"},[e("div",p1,L(f.$moment().day(B).format("dddd")),1),e("div",{class:F(["font-bold tabular-nums",t(u)(y)])},L(y),3)]))),128))]),e("div",L1,[e("div",C1,L(f.$t("Total")),1),e("div",g1,L(t(_)),1)])])])),[[P,x,void 0,{bubble:!0}]]):M("",!0)]),_:1})}}}),h1=m(f1,[["__file","WeekSummary.vue"]]),m1={viewBox:"0 0 20 20",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"},v1=e("g",{id:"language_svg__Artboard-Copy","stroke-width":"1","fill-rule":"evenodd"},[e("path",{d:"M9.99994982,20.0000009 C5.4409049,19.9997296 1.45868702,16.9171201 0.315887784,12.5036294 L0.313920435,12.4941765 L0.219086754,12.0914893 C0.102131532,11.541573 0.0316907561,10.9828384 0.00851136388,10.4214468 L3.55271368e-15,10.0000009 C3.55271368e-15,8.25664079 0.447319882,6.5757241 1.28618607,5.09035045 L1.44604756,4.81676117 C3.25398288,1.8319198 6.49533701,-0.00145955899 10.0003718,8.71859633e-07 L9.99898253,0.00101353032 L10.0010079,0.00101353032 L10.3175135,0.00490454043 C13.6997972,0.110711699 16.8008078,1.92236954 18.5539572,4.81676117 L18.7088549,5.08151923 C19.499243,6.48187536 19.9373904,8.0401147 19.9937898,9.63208525 L20.0000127,10.0000009 C20.0000127,10.8510744 19.8932004,11.6899056 19.6845297,12.5020295 L19.6860699,12.4941765 C18.5651261,16.8251724 14.7237932,19.8707099 10.2842237,19.9959855 L10.0000549,20.0000009 L9.99994982,20.0000009 Z M7.21417275,15.2394927 L7.24752336,15.3267026 C7.94843107,17.1100969 8.96659772,18.2278483 10.0000024,18.2278483 L10.1239185,18.222512 C11.1143528,18.1373632 12.07961,17.0387612 12.7524814,15.3267026 L12.784805,15.2405053 L12.4136206,15.2930985 C11.7750586,15.3737652 11.1314312,15.4221497 10.4851619,15.4376299 L10.0000024,15.4430608 C9.17936084,15.4430608 8.36615072,15.391255 7.56404442,15.2892073 L7.21417275,15.2394927 Z M17.1605006,14.0546827 L17.0699894,14.0925218 C16.4719021,14.3307132 15.8626904,14.5381771 15.2447778,14.7142915 L14.7908807,14.8364547 L14.7874593,14.8503162 C14.5392191,15.6988745 14.2257759,16.4733637 13.8563168,17.149458 L13.7610074,17.3184798 L13.9777312,17.2030221 C15.2404319,16.5054127 16.3091719,15.4822205 17.0604904,14.2290156 L17.1605006,14.0546827 Z M2.83948974,14.0556953 L2.93951437,14.2290156 C3.69083283,15.4822205 4.75957284,16.5054127 6.02227356,17.2030221 L6.23695768,17.3174671 L6.14368794,17.149458 C5.77422883,16.4733637 5.46078568,15.6988745 5.21254545,14.8503162 L5.20809705,14.8374674 L5.19470942,14.8339022 C4.41848318,14.6329345 3.65703316,14.3832888 2.91403176,14.086529 L2.83948974,14.0556953 Z M13.6313872,8.85265801 L13.3137463,8.9420251 C12.2397977,9.22380399 11.1265358,9.36871862 10.0000024,9.36710246 C8.85812646,9.36710246 7.73865697,9.21956526 6.66376519,8.93589878 L6.36759058,8.85265801 L6.3527383,9.09264686 C6.34235581,9.29101597 6.33531818,9.49167761 6.33178003,9.69440032 L6.32911676,10.0000012 C6.32911676,11.1259937 6.43731509,12.1931401 6.62798441,13.1629283 L6.66632472,13.34886 L7.06537011,13.4237498 C7.86620283,13.5601335 8.68108006,13.64085 9.5055719,13.6639672 L10.0013853,13.6709313 C10.9803933,13.6724382 11.9541326,13.5906846 12.9124743,13.4282603 L13.332653,13.3498726 L13.3720204,13.1629283 C13.5453561,12.2813027 13.650534,11.3192157 13.6682247,10.3056021 L13.670888,10.0000012 C13.670888,9.69291239 13.6628402,9.39020052 13.6472665,9.09264686 L13.6313872,8.85265801 Z M2.37366702,6.90329116 C1.97887564,7.87687631 1.7721481,8.92311196 1.7721481,10.0007855 C1.77153624,10.6956826 1.85878954,11.3878651 2.03183575,12.0608632 L1.9463253,11.690126 L2.03097024,11.7359037 C2.89208552,12.182265 3.78745888,12.5545865 4.70943541,12.8495295 L4.77467938,12.86886 L4.74666221,12.6840182 C4.63623348,11.9228178 4.57223834,11.1266678 4.55938051,10.3080231 L4.55696508,10.0000012 C4.55696508,9.48495511 4.57717027,8.97808786 4.61643227,8.48244021 L4.63898319,8.21670872 L4.57998785,8.19044022 C3.90958723,7.88370555 3.26556819,7.51984909 2.6545,7.10225098 L2.37366702,6.90329116 Z M17.6263234,6.90430382 L17.3381425,7.10788008 C16.7229308,7.52759028 16.0748147,7.89220024 15.40151,8.19884579 L15.3599945,8.21670872 L15.3835725,8.48244021 C15.4149821,8.87895833 15.4341953,9.28265699 15.4406243,9.69197935 L15.4430397,10.0000012 C15.4430397,10.9270843 15.3775749,11.8276677 15.2533426,12.6840182 L15.2242983,12.86886 L15.2703888,12.8556471 C16.196034,12.5605852 17.0978408,12.1870287 17.9656804,11.7375886 L18.0526524,11.690126 L18.0611073,11.6572984 C18.1439576,11.2510853 18.1963315,10.8376 18.2173407,10.4189238 L18.2278725,9.99859435 C18.2295464,8.93779494 18.0250811,7.89024295 17.6294435,6.913132 L17.6263234,6.90430382 Z M9.8760863,1.77749042 C8.51423914,1.89457011 7.19999236,3.92770965 6.62798441,6.83707415 L6.58429941,7.06632912 L6.87586224,7.15606858 C7.76657043,7.41244065 8.69503567,7.55981171 9.64434028,7.58939599 L10.0012733,7.59496324 C11.0591514,7.59646905 12.1033202,7.44848116 13.104965,7.16170852 L13.4146783,7.06734177 L13.3720204,6.83707415 C12.8000124,3.92770965 11.4857656,1.89457011 10.1239185,1.77749042 L10.0000024,1.77215414 L9.8760863,1.77749042 Z M6.23695768,2.68253219 L6.09753598,2.7548637 C5.00253235,3.3444018 4.04300548,4.1809609 3.30460148,5.21450523 L3.22429982,5.32962047 L3.45982353,5.50313331 C3.8372692,5.77289042 4.22996958,6.0184174 4.63580996,6.23861601 L4.90936291,6.38177224 L4.94654253,6.20195264 C5.21899372,4.9364625 5.62644519,3.79707656 6.14368794,2.85054443 L6.23695768,2.68253219 Z M13.76202,2.68253219 L13.8563168,2.85054443 C14.3735596,3.79707656 14.781011,4.9364625 15.0534622,6.20195264 L15.0896148,6.38075958 L15.3514051,6.24574777 C15.759434,6.02522562 16.1546361,5.77893625 16.5344817,5.50782081 L16.7746779,5.32962047 L16.6954033,5.21450523 C15.9569993,4.1809609 14.9974724,3.3444018 13.9024688,2.7548637 L13.76202,2.68253219 Z",id:"language_svg__Shape","fill-rule":"nonzero"})],-1),w1=[v1];function x1(d,o){return n(),s("svg",m1,w1)}const y1={render:x1},b1=v({__name:"LanguageSwitcher",setup(d){const{locale:o,locales:i,setLocale:r}=J(),u=K(()=>{const l=i.value.findIndex(_=>_.code===o.value),a=l!==i.value.length-1?l+1:0;return i.value.at(a)});return(l,a)=>(n(),s("button",{type:"button",class:"inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded bg-primary-500 px-3 py-2 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-900 dark:ring-gray-600",onClick:a[0]||(a[0]=_=>t(r)(t(u).code))},[k(L(t(u).name)+" ",1),p(t(y1),{class:"h-5 w-5"})]))}}),k1=m(b1,[["__file","LanguageSwitcher.vue"]]),$1=v({name:"ClientOnly",inheritAttrs:!1,props:["fallback","placeholder","placeholderTag","fallbackTag"],setup(d,{slots:o,attrs:i}){const r=$(!1);return Q(()=>{r.value=!0}),u=>{var C;if(r.value)return(C=o.default)==null?void 0:C.call(o);const l=o.fallback||o.placeholder;if(l)return l();const a=u.fallback||u.placeholder||"",_=u.fallbackTag||u.placeholderTag||"span";return s(_,i,a)}}}),M1={name:X,props:{placeholder:String,tag:{type:String,default:"span"}}};function Z1(d,o,i,r,u,l){const a=$1;return n(),h(a,{placeholder:i.placeholder,"placeholder-tag":i.tag},{default:Z(()=>[V(d.$slots,"default")]),_:3},8,["placeholder","placeholder-tag"])}const S1=m(M1,[["render",Z1],["__file","component.vue3.vue"]]),I1=()=>e1("color-mode").value,j1={viewBox:"0 0 20 20",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"},B1=e("g",{id:"moon_svg__Artboard-Copy-4","stroke-width":"1","fill-rule":"evenodd"},[e("path",{d:"M6.37530016,0.0682308493 C7.07901057,-0.225334742 7.78518704,0.480930655 7.49153285,1.18460409 C7.05518621,2.2302065 6.82777017,3.35584862 6.82777017,4.51559498 C6.82777017,9.29674187 10.7032605,13.1722322 15.4855648,13.1722329 C16.628647,13.1737831 17.7606364,12.9481093 18.8157348,12.5083291 C19.5193711,12.2150434 20.2252693,12.9211543 19.9317715,13.6247022 C18.3210146,17.4858712 14.547185,20.0003602 10.3635797,20 C4.6397145,20 0,15.3602878 0,9.63649562 C-0.000357876646,5.45281738 2.51413116,1.67898771 6.37530016,0.0682308493 Z M5.29542347,2.61552408 L5.10797802,2.7549784 C2.9970027,4.36834315 1.70670823,6.8972007 1.70694254,9.63642261 C1.70694254,14.4175695 5.58243284,18.2930598 10.3636527,18.2930598 C13.1028174,18.2932941 15.6316626,17.0029996 17.2450247,14.8920243 L17.3835029,14.7026281 L17.1152305,14.7517565 C16.7115396,14.815771 16.3038779,14.8558541 15.8944045,14.8715816 L15.4844074,14.8791747 C9.76054213,14.8791747 5.12082763,10.2394602 5.12082763,4.51559498 C5.12082763,3.96103262 5.16443395,3.41245682 5.25022648,2.8736174 L5.29542347,2.61552408 Z",id:"moon_svg__Path","fill-rule":"nonzero"})],-1),z1=[B1];function T1(d,o){return n(),s("svg",j1,z1)}const U1={render:T1},A1={viewBox:"0 0 20 20",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"},D1=e("g",{id:"sun_svg__Artboard-Copy-3","stroke-width":"1","fill-rule":"evenodd"},[e("path",{d:"M10,15.9493671 C10.4893662,15.9493671 10.8860759,16.3460768 10.8860759,16.835443 L10.8860759,19.1139241 C10.8860759,19.6032903 10.4893662,20 10,20 C9.51063377,20 9.11392405,19.6032903 9.11392405,19.1139241 L9.11392405,16.835443 C9.11392405,16.3460768 9.51063377,15.9493671 10,15.9493671 Z M14.2068674,14.2068674 C14.5529016,13.8608332 15.1139339,13.8608332 15.459968,14.2068674 L17.0711073,15.8180066 C17.4171415,16.1640408 17.4171415,16.7250731 17.0711073,17.0711073 C16.7250731,17.4171415 16.1640408,17.4171415 15.8180066,17.0711073 L14.2068674,15.459968 C13.8608332,15.1139339 13.8608332,14.5529016 14.2068674,14.2068674 Z M4.54003197,14.2068674 C4.88606615,13.8608332 5.44709841,13.8608332 5.79313259,14.2068674 C6.13916677,14.5529016 6.13916677,15.1139339 5.79313259,15.459968 L4.18199335,17.0711073 C3.83595917,17.4171415 3.27492691,17.4171415 2.92889273,17.0711073 C2.58285854,16.7250731 2.58285854,16.1640408 2.92889273,15.8180066 L4.54003197,14.2068674 Z M10,5.3164557 C12.5866501,5.3164557 14.6835443,7.41334991 14.6835443,10 C14.6835443,12.5866501 12.5866501,14.6835443 10,14.6835443 C7.41334991,14.6835443 5.3164557,12.5866501 5.3164557,10 C5.3164557,7.41334991 7.41334991,5.3164557 10,5.3164557 Z M10,7.08860759 C8.39208237,7.08860759 7.08860759,8.39208237 7.08860759,10 C7.08860759,11.6079176 8.39208237,12.9113924 10,12.9113924 C11.6079176,12.9113924 12.9113924,11.6079176 12.9113924,10 C12.9113924,8.39208237 11.6079176,7.08860759 10,7.08860759 Z M19.1139241,9.11392405 C19.6032903,9.11392405 20,9.51063377 20,10 C20,10.4893662 19.6032903,10.8860759 19.1139241,10.8860759 L16.835443,10.8860759 C16.3460768,10.8860759 15.9493671,10.4893662 15.9493671,10 C15.9493671,9.51063377 16.3460768,9.11392405 16.835443,9.11392405 L19.1139241,9.11392405 Z M3.16455696,9.11392405 C3.6539232,9.11392405 4.05063291,9.51063377 4.05063291,10 C4.05063291,10.4893662 3.6539232,10.8860759 3.16455696,10.8860759 L0.886075949,10.8860759 C0.396709715,10.8860759 0,10.4893662 0,10 C0,9.51063377 0.396709715,9.11392405 0.886075949,9.11392405 L3.16455696,9.11392405 Z M15.8180066,2.92889273 C16.1640408,2.58285854 16.7250731,2.58285854 17.0711073,2.92889273 C17.4171415,3.27492691 17.4171415,3.83595917 17.0711073,4.18199335 L15.459968,5.79313259 C15.1139339,6.13916677 14.5529016,6.13916677 14.2068674,5.79313259 C13.8608332,5.44709841 13.8608332,4.88606615 14.2068674,4.54003197 L15.8180066,2.92889273 Z M2.92889273,2.92889273 C3.27492691,2.58285854 3.83595917,2.58285854 4.18199335,2.92889273 L5.79313259,4.54003197 C6.13916677,4.88606615 6.13916677,5.44709841 5.79313259,5.79313259 C5.44709841,6.13916677 4.88606615,6.13916677 4.54003197,5.79313259 L2.92889273,4.18199335 C2.58285854,3.83595917 2.58285854,3.27492691 2.92889273,2.92889273 Z M10,0 C10.4893662,0 10.8860759,0.396709715 10.8860759,0.886075949 L10.8860759,3.16455696 C10.8860759,3.6539232 10.4893662,4.05063291 10,4.05063291 C9.51063377,4.05063291 9.11392405,3.6539232 9.11392405,3.16455696 L9.11392405,0.886075949 C9.11392405,0.396709715 9.51063377,0 10,0 Z",id:"sun_svg__Shape","fill-rule":"nonzero"})],-1),O1=[D1];function N1(d,o){return n(),s("svg",A1,O1)}const V1={render:N1},R1={viewBox:"0 0 20 20",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"},H1=e("g",{id:"computer_svg__Artboard-Copy-5","stroke-width":"1","fill-rule":"evenodd"},[e("path",{d:"M16.835443,0 C18.5831796,0 20,1.41682041 20,3.16455696 L20,13.0379747 C20,14.7857112 18.5831796,16.2025316 16.835443,16.2025316 L13.923038,16.2025316 L13.9240506,16.3363087 C13.9239898,16.843794 14.1031923,17.3328114 14.426658,17.7187732 L14.5546516,17.858513 L15.1835123,18.4873737 C15.7417091,19.0455705 15.3463714,20 14.556962,20 L5.44303797,20 C4.65362861,20 4.25829095,19.0455705 4.81648766,18.4873737 L5.44544304,17.8584184 C5.84920608,17.4547773 6.07601776,16.9072296 6.07594937,16.3362025 L6.07594937,16.2025316 L3.16455696,16.2025316 C1.47708719,16.2025316 0.0981052319,14.8817383 0.00500953182,13.2175501 L0,13.0379747 L0,3.16455696 L0.00500953182,2.98498159 C0.0981052319,1.32079334 1.47708719,0 3.16455696,0 L16.835443,0 Z M12.1518987,16.2025316 L7.84708861,16.2025316 L7.84810126,16.3360964 C7.848178,16.9767679 7.69157878,17.6012985 7.39954357,18.1584439 L7.36,18.2278481 L12.6389873,18.2278481 L12.6004785,18.158472 C12.3449284,17.6709589 12.1930883,17.1318828 12.1591727,16.575575 L12.1518987,16.3362025 L12.1518987,16.2025316 Z M18.2278481,12.841519 L18.1835012,12.8638938 C17.7745288,13.0567371 17.3175773,13.164557 16.835443,13.164557 L3.16455696,13.164557 C2.68242274,13.164557 2.2254712,13.0567371 1.8164988,12.8638938 L1.7721519,12.841519 L1.7721519,13.0379747 C1.7721519,13.7617432 2.32436868,14.3565346 3.03045906,14.4240057 L3.16455696,14.4303797 L16.835443,14.4303797 C17.6044471,14.4303797 18.2278481,13.8069788 18.2278481,13.0379747 L18.2278481,12.841519 Z M16.835443,1.7721519 L3.16455696,1.7721519 C2.39555288,1.7721519 1.7721519,2.39555288 1.7721519,3.16455696 L1.7721519,10 C1.7721519,10.7690041 2.39555288,11.3924051 3.16455696,11.3924051 L16.835443,11.3924051 C17.6044471,11.3924051 18.2278481,10.7690041 18.2278481,10 L18.2278481,3.16455696 L18.2214741,3.03045906 C18.154003,2.32436868 17.5592116,1.7721519 16.835443,1.7721519 Z",id:"computer_svg__Shape","fill-rule":"nonzero"})],-1),P1=[H1];function Y1(d,o){return n(),s("svg",R1,P1)}const E1={render:Y1},W1=v({__name:"ColorSwitcher",setup(d){const o=I1(),i=()=>{const r=["system","light","dark"],l=(r.indexOf(o.preference)+1)%r.length;o.preference=r[l]};return(r,u)=>{const l=S1;return n(),s("button",{type:"button",class:"inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded bg-primary-500 px-3 py-2 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-900 dark:ring-gray-600",onClick:i},[p(l,{placeholder:"..."},{default:Z(()=>[t(o).preference==="dark"?(n(),s(b,{key:0},[k(L(r.$t("Sombre"))+" ",1),p(t(U1),{class:"h-5 w-5"})],64)):t(o).preference==="light"?(n(),s(b,{key:1},[k(L(r.$t("Clair"))+" ",1),p(t(V1),{class:"h-5 w-5"})],64)):(n(),s(b,{key:2},[k(L(r.$t("Système"))+" ",1),p(t(E1),{class:"h-5 w-5"})],64))]),_:1})])}}}),G1=m(W1,[["__file","ColorSwitcher.vue"]]),q1={viewBox:"0 0 20 20",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"},F1=e("g",{id:"logout_svg__Artboard-Copy-2","stroke-width":"1","fill-rule":"evenodd"},[e("path",{d:"M9.98487953,0 C11.8560257,0 13.4043588,1.42168258 13.4043588,3.21809065 L13.4043588,6.98581807 C13.4043588,7.51460542 12.975692,7.94327227 12.4469046,7.94327227 C11.9181173,7.94327227 11.4894504,7.51460542 11.4894504,6.98581807 L11.4894504,3.21809065 C11.4894504,2.51746865 10.8332111,1.9149084 9.98487953,1.9149084 L3.41947929,1.9149084 C2.57114768,1.9149084 1.9149084,2.51746865 1.9149084,3.21809065 L1.9149084,16.7819093 C1.9149084,17.4825314 2.57114768,18.0850916 3.41947929,18.0850916 L9.98487953,18.0850916 C10.8332111,18.0850916 11.4894504,17.4825314 11.4894504,16.7819093 L11.4894504,13.0141819 C11.4894504,12.4853946 11.9181173,12.0567277 12.4469046,12.0567277 C12.975692,12.0567277 13.4043588,12.4853946 13.4043588,13.0141819 L13.4043588,16.7819093 C13.4043588,18.5783174 11.8560257,20 9.98487953,20 L3.41947929,20 C1.54833308,20 0,18.5783174 0,16.7819093 L0,3.21809065 C0,1.42168258 1.54833308,0 3.41947929,0 L9.98487953,0 Z M7.67529927,6.11524086 C8.05400191,5.74618751 8.66017791,5.75400981 9.02923126,6.13271245 C9.39828461,6.51141509 9.39046231,7.11759109 9.01175967,7.48664444 L7.41452534,9.04165036 L19.0123049,9.0425458 C19.5004163,9.0425458 19.9032179,9.40780039 19.9622991,9.87989898 L19.9697591,10 C19.9697591,10.5287874 19.5410922,10.9574542 19.0123049,10.9574542 L7.41452534,10.9565588 L9.01175967,12.5133556 C9.35890376,12.8516545 9.39440534,13.3892023 9.11364649,13.7681417 L9.02923126,13.8672876 C8.66017791,14.2459902 8.05400191,14.2538125 7.67529927,13.8847591 L4.39259915,10.6857018 L4.38349889,10.676435 L4.37512756,10.6682302 L4.36270846,10.6534561 L4.34501477,10.6358834 L4.32331606,10.6085926 L4.30565363,10.5887673 L4.29486599,10.5735771 L4.28611212,10.5615405 L4.27491902,10.5470142 L4.25000242,10.5068288 L4.23418228,10.4835658 L4.22921199,10.4729076 L4.22197943,10.4620737 L4.18763112,10.3908401 L4.17820591,10.3717106 L4.17559455,10.3645785 L4.16782272,10.3460503 C4.14007661,10.2744993 4.12068195,10.1987841 4.11083508,10.120101 L4.10994055,10.1139991 L4.10665785,10.052722 L4.10345486,10.0123543 L4.10446938,10.0001988 L4.10345486,9.98764572 L4.10665785,9.94548713 L4.10966658,9.89001588 L4.10994055,9.88530429 L4.11212902,9.86998503 L4.11978865,9.83059263 L4.13261669,9.76424979 L4.13620215,9.75180782 L4.14605025,9.72007505 L4.16782272,9.6539497 L4.17559455,9.63472485 L4.18872535,9.60627478 L4.21555592,9.54989595 L4.21936389,9.54280925 L4.22702352,9.52967845 L4.23418228,9.5164342 L4.25219089,9.48700335 L4.27491902,9.45298582 L4.28611212,9.43557438 L4.29486599,9.42463204 L4.30565363,9.41123274 L4.32112759,9.39180504 L4.34501477,9.36411655 L4.36817963,9.33928184 L4.38349889,9.32286834 L4.39259915,9.31429821 L7.67529927,6.11524086 Z",id:"logout_svg__Shape","fill-rule":"nonzero"})],-1),J1=[F1];function K1(d,o){return n(),s("svg",q1,J1)}const Q1={render:K1},X1={key:0,class:"absolute right-0 top-full flex w-64 min-w-full translate-y-2 flex-col gap-6 rounded border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"},e0={class:"flex flex-col gap-2"},t0={class:"border-b pb-2 dark:border-gray-800"},o0={class:"text-xs font-bold uppercase opacity-80"},n0={key:0,class:"mt-1 block text-2xl font-black tabular-nums leading-[1]"},s0=v({__name:"UserMenu",props:{is_open:{type:Boolean,default:!1}},emits:["update:is_open"],setup(d,{emit:o}){const i=R(),{logout:r}=i,u=j(),l=T();A(()=>l.name,()=>{o("update:is_open",!1)});function a(){o("update:is_open",!1)}return(_,C)=>{const c=k1,w=G1,x=D("on-click-outside");return n(),h(N,{"enter-active-class":"transition transform origin-top-right ease-out duration-200","enter-from-class":"opacity-0 scale-95","enter-to-class":"opacity-100 scale-100","leave-active-class":"transition transform origin-top-right ease-in duration-200","leave-from-class":"opacity-100 scale-100","leave-to-class":"opacity-0 scale-95"},{default:Z(()=>[_.is_open?O((n(),s("div",X1,[e("div",e0,[e("div",t0,[e("div",o0,L(_.$t("Bonjour")),1),t(u)?(n(),s("div",n0,L(t(u).displayName),1)):M("",!0)]),p(c),p(w),e("button",{class:"inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded bg-red-500 px-3 py-2 text-sm font-bold text-white shadow ring-primary-200 transition hover:bg-red-400 focus:outline-none focus:ring active:bg-red-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-900 dark:ring-gray-600",type:"button",onClick:C[0]||(C[0]=(...f)=>t(r)&&t(r)(...f))},[k(L(_.$t("Déconnexion"))+" ",1),p(t(Q1),{class:"h-5 w-5"})])])])),[[x,a,void 0,{bubble:!0}]]):M("",!0)]),_:1})}}}),r0=m(s0,[["__file","UserMenu.vue"]]),a0={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},i0=e("path",{"fill-rule":"evenodd",d:"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z","clip-rule":"evenodd"},null,-1),l0=[i0];function c0(d,o){return n(),s("svg",a0,l0)}const d0={render:c0},u0={viewBox:"0 0 20 20",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"},_0=e("g",{id:"clock_svg__Page-1","stroke-width":"1","fill-rule":"evenodd"},[e("g",{id:"clock_svg__Group","fill-rule":"nonzero"},[e("path",{d:"M10,0 C15.5228475,0 20,4.47715245 20,10 C20,13.5726558 18.0940108,16.873926 15,18.660254 C11.9059893,20.4465819 8.09401074,20.4465819 5,18.660254 C1.90598923,16.873926 0,13.5726558 0,10 C0,4.47715245 4.47715251,0 10,0 Z M10,2 C5.58172201,2 2,5.58172195 2,10 C2,12.8581246 3.52479138,15.4991408 6,16.9282032 C8.4752086,18.3572655 11.5247914,18.3572655 14,16.9282032 C16.4752086,15.4991408 18,12.8581246 18,10 C18,5.58172195 14.418278,2 10,2 Z M10,4.99999981 C10.5522847,4.99999981 11,5.44771506 11,5.99999981 L11,9.58499981 L13.7071068,12.292893 C14.0675907,12.653377 14.0953203,13.220608 13.7902954,13.6128993 L13.7071068,13.7071066 C13.3165825,14.0976309 12.6834175,14.0976309 12.2928932,13.7071066 L9.29289322,10.7071066 C9.10535684,10.5195702 9,10.2652163 9,9.99999981 L9,5.99999981 C9,5.44771506 9.44771525,4.99999981 10,4.99999981 Z",id:"clock_svg__Combined-Shape"})])],-1),p0=[_0];function L0(d,o){return n(),s("svg",u0,p0)}const C0={render:L0},g0={viewBox:"0 0 18 23",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"},f0=e("g",{id:"user_svg__Page-1","stroke-width":"1","fill-rule":"evenodd"},[e("g",{id:"user_svg__user",transform:"translate(0.7498, 0.75)","fill-rule":"nonzero"},[e("path",{d:"M8.49930622,10.4904704 C13.1395776,10.4904704 16.922393,14.2119494 16.9984963,18.8518362 C17.0045898,19.2486142 16.7757868,19.6116118 16.4151161,19.7769937 C13.9314653,20.9158468 11.2305868,21.5037078 8.49930622,21.5000675 C5.74557973,21.5000675 3.05815087,20.9129719 0.583116998,19.7768196 C0.222653024,19.6113504 -0.00597493482,19.2484628 0.000118881152,18.8516597 C0.0762194361,14.2119494 3.85903483,10.4904704 8.49930622,10.4904704 Z M8.49711636,12.49 L8.26457644,12.4946508 C5.06964755,12.6086035 2.42353247,15.0393635 2.04571515,18.2106845 L2.04311636,18.228 L2.30854626,18.337705 C3.96831295,18.9872584 5.72032656,19.3695386 7.51221175,19.4719133 L8.00185692,19.4928843 L8.50065391,19.5000638 C10.6165363,19.5028772 12.7134529,19.1091668 14.6794614,18.3414755 L14.9551164,18.228 L14.9532462,18.2137771 C14.5850421,15.1229914 12.0612875,12.726181 8.96832549,12.5069686 L8.72930938,12.4944262 L8.49711636,12.49 Z M8.49930622,0 C11.1226588,0 13.2493062,2.12664744 13.2493062,4.75 C13.2493062,7.37335256 11.1226588,9.5 8.49930622,9.5 C5.87595366,9.5 3.74930622,7.37335256 3.74930622,4.75 C3.74930622,2.12664744 5.87595366,0 8.49930622,0 Z M8.49930622,2 C6.98052316,2 5.74930622,3.23121694 5.74930622,4.75 C5.74930622,6.26878306 6.98052316,7.5 8.49930622,7.5 C10.0180893,7.5 11.2493062,6.26878306 11.2493062,4.75 C11.2493062,3.23121694 10.0180893,2 8.49930622,2 Z",id:"user_svg__Combined-Shape"})])],-1),h0=[f0];function m0(d,o){return n(),s("svg",g0,h0)}const v0={render:m0},w0={class:"fixed top-0 z-40 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-900"},x0={class:"flex h-16 items-center justify-between px-4 lg:px-8"},y0={class:"relative flex items-center gap-1 sm:gap-2"},b0={class:"text-xl font-bold"},k0=v({__name:"AppHeader",setup(d){const o=j(),i=z(),{weekRemaining:r,selectedDay:u,menuOpened:l}=U(i),a=$(!1),_=$(!1);return(C,c)=>{const w=Y,x=h1,f=r0;return n(),s("header",w0,[e("div",x0,[e("button",{type:"button",class:"-m-2 flex rounded p-2 text-2xl font-black ring-primary-200 focus:outline-none focus:ring dark:ring-gray-600",onClick:c[0]||(c[0]=g=>u.value=C.$moment().format("YYYY-MM-DD"))},[p(w)]),e("div",y0,[e("button",{type:"button",class:"inline-flex h-10 flex-shrink-0 items-center justify-center gap-1 rounded bg-primary-500 px-2 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 dark:text-gray-800 dark:ring-gray-600 md:px-3",onClick:c[1]||(c[1]=S(g=>a.value=!t(a),["stop"]))},[p(t(C0),{class:"h-5"}),e("span",b0,L(t(r)),1)]),p(x,{is_open:t(a),"onUpdate:is_open":c[2]||(c[2]=g=>I(a)?a.value=g:null)},null,8,["is_open"]),e("button",{type:"button",class:"inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 bg-cover font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 dark:text-gray-800 dark:ring-gray-600",style:t1({backgroundImage:`url('${t(o).photoURL}')`}),onClick:c[3]||(c[3]=S(g=>_.value=!t(_),["stop"]))},[t(o).photoURL?M("",!0):(n(),h(t(v0),{key:0,class:"h-6"}))],4),p(f,{is_open:t(_),"onUpdate:is_open":c[4]||(c[4]=g=>I(_)?_.value=g:null)},null,8,["is_open"]),e("button",{type:"button",class:"inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-500 font-bold text-white shadow ring-primary-200 transition hover:bg-primary-400 focus:outline-none focus:ring active:bg-primary-600 dark:text-gray-800 dark:ring-gray-600 xl:hidden",onClick:c[5]||(c[5]=S(g=>l.value=!t(l),["stop"]))},[t(l)?(n(),h(t(d0),{key:1,class:"h-6 w-6"})):(n(),h(t(G),{key:0,class:"h-4 w-4"}))])])])])}}}),$0=m(k0,[["__file","AppHeader.vue"]]),M0={},Z0={class:"flex min-h-screen pt-16"};function S0(d,o){const i=$0;return n(),s(b,null,[p(i),e("main",Z0,[V(d.$slots,"default")])],64)}const T0=m(M0,[["render",S0],["__file","default.vue"]]);export{T0 as default};
