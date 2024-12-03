import{u as X,r as f,y as Y,c as Z,b as n,d as o,z as g,t as ee,w as s,e as oe,h as i,o as te,i as S,f as U}from"./index-DzRK8a2J.js";import{u as ne}from"./health-BDf4i0qw.js";import{u as se}from"./medicine-DTCT_huw.js";import{A as ae}from"./AvatarLetter-PI2cnooE.js";import{_ as le}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{s as ie}from"./function-call-Buk7ar9h.js";const ue={class:"profile-page"},re={class:"user-card"},de={class:"avatar-edit"},ce={class:"username"},pe={class:"menu-list"},me={class:"menu-group"},ve={class:"menu-group"},fe={class:"menu-group"},_e={class:"menu-group"},ge={class:"logout-btn"},he={class:"popup-content"},we={__name:"Profile",setup(ke){const u=oe(),d=X(),I=ne(),A=se(),_=f(!1),c=f(!1),p=f(!1),w=f(0),a=f({username:"",email:"",phone:"",age:"",gender:""}),B=["男","女","其他"],N=[{name:"拍照",value:"camera"},{name:"从相册选择",value:"album"}];Y(async()=>{var l;(l=d.user)!=null&&l.userId&&await Promise.all([P(),x()])});const P=async()=>{const l=await d.getUserInfo();l&&(a.value={...l})},x=async()=>{w.value=0},H=()=>{_.value=!0},M=async l=>{l.value,_.value=!1},R=()=>{c.value=!0},k=async()=>{try{await d.updateUserInfo(a.value),U("保存成功"),c.value=!1}catch{U("保存失败")}},$=l=>{a.value.gender=l,p.value=!1},q=()=>{u.push("/health")},z=()=>{u.push("/medicine")},L=()=>{u.push("/medicine/history")},D=()=>{u.push("/notifications")},G=()=>{u.push("/chat")},T=()=>{u.push("/settings/notifications")},E=()=>{u.push("/settings/privacy")},O=()=>{u.push("/about")},j=()=>{ie({title:"提示",message:"确认退出登录？",showCancelButton:!0}).then(async l=>{l==="confirm"&&(await d.logout(),u.replace("/login"))})};return(l,e)=>{var y,V;const F=i("van-icon"),r=i("van-cell"),h=i("van-badge"),m=i("van-cell-group"),b=i("van-button"),J=i("van-action-sheet"),K=i("van-nav-bar"),v=i("van-field"),Q=i("van-form"),C=i("van-popup"),W=i("van-picker");return te(),Z("div",ue,[n("div",re,[n("div",{class:"avatar-wrapper",onClick:H},[o(ae,{username:((y=g(d).user)==null?void 0:y.username)||"?",size:80},null,8,["username"]),n("div",de,[o(F,{name:"photograph"})])]),n("h2",ce,ee((V=g(d).user)==null?void 0:V.username),1)]),n("div",pe,[n("div",me,[e[11]||(e[11]=n("div",{class:"group-title"},"个人资料",-1)),o(m,{inset:""},{default:s(()=>[o(r,{title:"基本信息","is-link":"",onClick:R}),o(r,{title:"健康档案","is-link":"",onClick:q},{"right-icon":s(()=>[o(h,{content:g(I).unreadCount||""},null,8,["content"])]),_:1})]),_:1})]),n("div",ve,[e[12]||(e[12]=n("div",{class:"group-title"},"用药管理",-1)),o(m,{inset:""},{default:s(()=>[o(r,{title:"用药提醒","is-link":"",onClick:z},{"right-icon":s(()=>[o(h,{content:g(A).activeReminders.length||""},null,8,["content"])]),_:1}),o(r,{title:"用药记录","is-link":"",onClick:L})]),_:1})]),n("div",fe,[e[13]||(e[13]=n("div",{class:"group-title"},"消息通知",-1)),o(m,{inset:""},{default:s(()=>[o(r,{title:"系统通知","is-link":"",onClick:D},{"right-icon":s(()=>[o(h,{content:w.value},null,8,["content"])]),_:1}),o(r,{title:"问诊记录","is-link":"",onClick:G})]),_:1})]),n("div",_e,[e[14]||(e[14]=n("div",{class:"group-title"},"系统设置",-1)),o(m,{inset:""},{default:s(()=>[o(r,{title:"通知设置","is-link":"",onClick:T}),o(r,{title:"隐私设置","is-link":"",onClick:E}),o(r,{title:"关于我们","is-link":"",onClick:O})]),_:1})])]),n("div",ge,[o(b,{block:"",type:"danger",onClick:j},{default:s(()=>e[15]||(e[15]=[S(" 退出登录 ")])),_:1})]),o(J,{show:_.value,"onUpdate:show":e[0]||(e[0]=t=>_.value=t),actions:N,"cancel-text":"取消",onSelect:M},null,8,["show"]),o(C,{show:c.value,"onUpdate:show":e[8]||(e[8]=t=>c.value=t),position:"bottom",round:"",style:{height:"70%"}},{default:s(()=>[n("div",he,[o(K,{title:"基本信息","left-arrow":"",onClickLeft:e[1]||(e[1]=t=>c.value=!1)},{right:s(()=>[o(b,{type:"primary",size:"small",onClick:k},{default:s(()=>e[16]||(e[16]=[S(" 保存 ")])),_:1})]),_:1}),o(Q,{onSubmit:k},{default:s(()=>[o(m,{inset:""},{default:s(()=>[o(v,{modelValue:a.value.username,"onUpdate:modelValue":e[2]||(e[2]=t=>a.value.username=t),label:"用户名",placeholder:"请输入用户名",rules:[{required:!0,message:"请输入用户名"}]},null,8,["modelValue"]),o(v,{modelValue:a.value.email,"onUpdate:modelValue":e[3]||(e[3]=t=>a.value.email=t),label:"邮箱",placeholder:"请输入邮箱",rules:[{required:!0,message:"请输入邮箱"},{pattern:/.+@.+/,message:"请输入正确的邮箱格式"}]},null,8,["modelValue"]),o(v,{modelValue:a.value.phone,"onUpdate:modelValue":e[4]||(e[4]=t=>a.value.phone=t),label:"手机号",placeholder:"请输入手机号",rules:[{required:!0,message:"请输入手机号"},{pattern:/^1[3-9]\d{9}$/,message:"请输入正确的手机号"}]},null,8,["modelValue"]),o(v,{modelValue:a.value.age,"onUpdate:modelValue":e[5]||(e[5]=t=>a.value.age=t),label:"年龄",type:"number",placeholder:"请输入年龄"},null,8,["modelValue"]),o(v,{modelValue:a.value.gender,"onUpdate:modelValue":e[6]||(e[6]=t=>a.value.gender=t),label:"性别",readonly:"","is-link":"",onClick:e[7]||(e[7]=t=>p.value=!0)},null,8,["modelValue"])]),_:1})]),_:1})])]),_:1},8,["show"]),o(C,{show:p.value,"onUpdate:show":e[10]||(e[10]=t=>p.value=t),position:"bottom",round:""},{default:s(()=>[o(W,{columns:B,onConfirm:$,onCancel:e[9]||(e[9]=t=>p.value=!1),"show-toolbar":""})]),_:1},8,["show"])])}}},Ie=le(we,[["__scopeId","data-v-e12a656a"]]);export{Ie as default};
