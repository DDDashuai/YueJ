import{u as oe}from"./chat-Cqxs3pXi.js";import{u as ne}from"./index-CfC59-8V.js";import{a as le}from"./date-mP0Ysl1n.js";import{r as i,_ as re,o as ie,aa as B,Q as v,V as s,R as o,a3 as b,a4 as L,a1 as G,w as u,u as ue,s as n,a as l,b as c,a5 as D,a2 as I,W as R,c as ce}from"./vendor-BBsPRJ_E.js";import{A as de}from"./AvatarLetter-UhON8Et9.js";import{_ as ve}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./utils-DXsv3KKR.js";const pe={class:"chat-page"},me={class:"message-list"},_e={key:0,class:"message-content user"},fe={class:"avatar"},he={class:"message-content ai"},ye={key:0,class:"typing"},ge={key:1,class:"ai-response"},we={class:"input-area"},Ce={class:"type-select"},ke={class:"type-options"},be=["onClick"],Ie={class:"message-input-wrapper"},xe={class:"toolbar-left"},Ve={class:"history-container"},Te={class:"message-count"},ze=Object.assign({name:"Chat"},{__name:"Chat",setup(He){const h=ue(),d=ne(),r=oe(),y=i(null),p=i(""),x=i(!1),m=i(!1),g=i(!1),U=i(!1),w=i(!1),M=i([]),V=i([]),_=i("western"),A=[{text:"西医咨询",value:"western"},{text:"中医咨询",value:"traditional"}],T=i(!1),F=a=>{_.value=a,T.value=!1};re(()=>r.chatHistory.length,()=>{z()}),ie(()=>{N()});const N=async()=>{var a;(a=d.user)!=null&&a.userId&&(await r.getChatGroups(d.user.userId),r.currentGroupId||await r.createChatGroup(),z())},z=async()=>{await B(),y.value&&(y.value.scrollTop=y.value.scrollHeight)},$=()=>{h.back()},W=async()=>{var a;if(p.value.trim()){if(!((a=d.user)!=null&&a.userId)){n("请先登录"),h.push("/login");return}x.value=!0;try{await r.sendMessage({userId:d.user.userId,message:p.value,type:"user",conversationType:_.value}),p.value=""}catch{n("发送失败")}finally{x.value=!1}}},j=a=>a.type.startsWith("image/")?a.size/1024/1024<2?!0:(n("图片大小不能超过2MB"),!1):(n("请上传图片文件"),!1),E=async a=>{var f;if(!((f=d.user)!=null&&f.userId)){n("请先登录"),h.push("/login");return}const e=new FormData;e.append("image",a.file),e.append("conversationType",_.value);try{await r.sendImage(e),V.value=[]}catch{n("图片分析失败")}},O=()=>{m.value=!0,H()},H=async()=>{var a;if(!g.value&&(a=d.user)!=null&&a.userId)try{const e=await r.getChatGroups(d.user.userId);M.value=e,U.value=!0}catch{n("加载历史记录失败")}finally{g.value=!1}},P=async a=>{try{if(m.value=!1,console.log("选择的聊天组:",a),!a.chat_group_id){n("无效的聊天记录");return}await r.loadGroupChat(d.user.userId,a.chat_group_id),await B(),z()}catch(e){console.error("加载聊天记录失败:",e),n("加载聊天记录失败")}},Q=async()=>{w.value=!0;try{await H()}finally{w.value=!1}},q=async()=>{var a;try{if(!((a=d.user)!=null&&a.userId)){n("请先登录"),h.push("/login");return}await r.createChatGroup(),r.chatHistory=[],m.value=!1,p.value="",_.value="western",n("新建聊天成功")}catch(e){console.error("新建聊天失败:",e),n("新建聊天失败")}};return(a,e)=>{const f=l("van-nav-bar"),S=l("van-loading"),C=l("van-icon"),J=l("van-popover"),K=l("van-uploader"),X=l("van-field"),Y=l("van-button"),Z=l("van-form"),ee=l("van-cell"),te=l("van-list"),ae=l("van-pull-refresh"),se=l("van-popup");return c(),v("div",pe,[s(f,{title:"智能问诊","left-arrow":"","right-text":"历史",onClickLeft:$,onClickRight:O,class:"chat-nav"}),o("div",{class:"chat-content",ref_key:"chatContainer",ref:y},[o("div",me,[(c(!0),v(b,null,L(G(r).chatHistory,(t,k)=>(c(),v("div",{key:k,class:D(["message",t.type==="user"?"message-right":"message-left"])},[t.type==="user"?(c(),v("div",_e,I(t.message),1)):(c(),v(b,{key:1},[o("div",fe,[s(de,{username:"AI",size:40})]),o("div",he,[t.loading?(c(),v("div",ye,[s(S,{type:"spinner",size:"20"}),e[7]||(e[7]=o("span",null,"AI正在思考...",-1))])):(c(),v("div",ge,I(t.response),1))])],64))],2))),128))])],512),o("div",we,[s(J,{show:T.value,"onUpdate:show":e[0]||(e[0]=t=>T.value=t),placement:"top-start",theme:"light",trigger:"click"},{reference:u(()=>[s(C,{name:_.value==="western"?"cluster-o":"flower-o",size:"20",class:"toolbar-icon"},null,8,["name"])]),default:u(()=>[o("div",Ce,[o("div",ke,[(c(),v(b,null,L(A,t=>o("div",{key:t.value,class:D(["type-option",{active:_.value===t.value}]),onClick:k=>F(t.value)},[s(C,{name:t.value==="western"?"cluster-o":"flower-o",class:"type-icon"},null,8,["name"]),R(" "+I(t.text),1)],10,be)),64))])])]),_:1},8,["show"]),s(Z,{onSubmit:W,class:"input-form"},{default:u(()=>[o("div",Ie,[o("div",xe,[s(K,{modelValue:V.value,"onUpdate:modelValue":e[1]||(e[1]=t=>V.value=t),"max-count":1,"before-read":j,"after-read":E},{default:u(()=>[s(C,{name:"add-o",size:"20",class:"toolbar-icon"})]),_:1},8,["modelValue"])]),s(X,{modelValue:p.value,"onUpdate:modelValue":e[2]||(e[2]=t=>p.value=t),placeholder:"请描述您的症状或者健康问题...",autosize:{minHeight:24,maxHeight:72},type:"textarea",class:"message-field"},null,8,["modelValue"]),s(Y,{type:"primary",size:"small",loading:x.value,"native-type":"submit",class:"send-btn",round:""},{default:u(()=>e[8]||(e[8]=[R(" 发送 ")])),_:1},8,["loading"])])]),_:1})]),s(se,{show:m.value,"onUpdate:show":e[6]||(e[6]=t=>m.value=t),position:"right",style:{width:"80%",height:"100%"},"z-index":"1000"},{default:u(()=>[o("div",Ve,[s(f,{title:"聊天历史","left-arrow":"",onClickLeft:e[3]||(e[3]=t=>m.value=!1)},{right:u(()=>[s(C,{name:"plus",size:"20",onClick:q})]),_:1}),s(ae,{modelValue:w.value,"onUpdate:modelValue":e[5]||(e[5]=t=>w.value=t),onRefresh:Q},{default:u(()=>[s(te,{loading:g.value,"onUpdate:loading":e[4]||(e[4]=t=>g.value=t),finished:U.value,"finished-text":"没有更多了",onLoad:H},{default:u(()=>[(c(!0),v(b,null,L(M.value,(t,k)=>(c(),ce(ee,{key:k,title:G(le)(t.created_at),label:t.last_message,"is-link":"",onClick:Le=>P(t)},{value:u(()=>[o("span",Te,I(t.message_count)+"条消息",1)]),_:2},1032,["title","label","onClick"]))),128))]),_:1},8,["loading","finished"])]),_:1},8,["modelValue"])])]),_:1},8,["show"])])}}}),Ae=ve(ze,[["__scopeId","data-v-ebc0542b"]]);export{Ae as default};
