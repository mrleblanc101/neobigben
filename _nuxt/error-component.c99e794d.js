import{_ as g,d as n,a as o,o as f,c as x,n as E,g as P,u as s}from"./entry.bc579f4f.js";const k={__name:"nuxt-error-page",props:{error:Object},setup(c){const{error:t}=c;(t.stack||"").split(`
`).splice(1).map(e=>({text:e.replace("webpack:/","").replace(".vue",".js").trim(),internal:e.includes("node_modules")&&!e.includes(".cache")||e.includes("internal")||e.includes("new Promise")})).map(e=>`<span class="stack${e.internal?" internal":""}">${e.text}</span>`).join(`
`);const r=Number(t.statusCode||500),a=r===404,u=t.statusMessage??(a?"Page Not Found":"Internal Server Error"),i=t.message||t.toString(),p=void 0,_=n(()=>o(()=>import("./error-404.d507ed22.js"),["./error-404.d507ed22.js","./entry.bc579f4f.js","./entry.5037b43f.css","./error-404.1474f64e.css"],import.meta.url).then(e=>e.default||e)),l=n(()=>o(()=>import("./error-500.e7dce3b7.js"),["./error-500.e7dce3b7.js","./entry.bc579f4f.js","./entry.5037b43f.css","./error-500.070dde72.css"],import.meta.url).then(e=>e.default||e)),d=a?_:l;return(e,m)=>(f(),x(s(d),E(P({statusCode:s(r),statusMessage:s(u),description:s(i),stack:s(p)})),null,16))}},h=g(k,[["__file","nuxt-error-page.vue"]]);export{h as default};