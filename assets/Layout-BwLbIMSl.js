import{l as f,e as g,r as k,m as w,h as d,o as l,n as c,w as t,d as a,i as s,p as h,c as x,q as T,x as V,K as y}from"./index-9Ol6iB9x.js";import{_ as v}from"./_plugin-vue_export-helper-DlAUqK2U.js";const N={__name:"TabBar",setup(b){const u=f(),i=g(),n=k(0),m={"/home":0,"/health":1,"/chat":2,"/medicine":3,"/profile":4};w(()=>u.path,o=>{n.value=m[o]??0},{immediate:!0});const p=()=>{i.push("/chat")},_=o=>{console.log("TabBar changed:",o)};return(o,e)=>{const r=d("van-tabbar-item"),C=d("van-tabbar");return l(),c(C,{modelValue:n.value,"onUpdate:modelValue":e[0]||(e[0]=B=>n.value=B),route:"",onChange:_},{default:t(()=>[a(r,{name:"home",to:"/home",icon:"home-o"},{default:t(()=>e[1]||(e[1]=[s(" 首页 ")])),_:1}),a(r,{name:"health",to:"/health",icon:"records"},{default:t(()=>e[2]||(e[2]=[s(" 健康 ")])),_:1}),a(r,{name:"chat",icon:"chat-o",onClick:p},{default:t(()=>e[3]||(e[3]=[s(" 问诊 ")])),_:1}),a(r,{name:"medicine",to:"/medicine",icon:"clock-o"},{default:t(()=>e[4]||(e[4]=[s(" 用药 ")])),_:1}),a(r,{name:"profile",to:"/profile",icon:"user-o"},{default:t(()=>e[5]||(e[5]=[s(" 我的 ")])),_:1})]),_:1},8,["modelValue"])}}},R=v(N,[["__scopeId","data-v-12480f73"]]),H={class:"layout"},I={__name:"Layout",setup(b){const u=f(),i=["/login","/register","/forgot-password"],n=h(()=>!i.includes(u.path)),m=h(()=>u.path==="/chat");return(p,_)=>{const o=d("router-view");return l(),x("div",H,[a(o,null,{default:t(({Component:e})=>[(l(),c(y,{include:["Home","Chat","Health","Medicine","Profile"]},[(l(),c(V(e)))],1024))]),_:1}),n.value&&!m.value?(l(),c(R,{key:0})):T("",!0)])}}},M=v(I,[["__scopeId","data-v-944ac4a7"]]);export{M as default};
