!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).QX=t()}(this,(function(){"use strict";const e=(()=>{var e=e||{};!function(){void 0===e.escapeMode&&(e.escapeMode=!0);e.attributePrefix=e.attributePrefix||"_",e.arrayAccessForm=e.arrayAccessForm||"none",e.emptyNodeForm=e.emptyNodeForm||"text",void 0===e.enableToStringFunc&&(e.enableToStringFunc=!0);e.arrayAccessFormPaths=e.arrayAccessFormPaths||[],void 0===e.skipEmptyTextNodesForObj&&(e.skipEmptyTextNodesForObj=!0);void 0===e.stripWhitespaces&&(e.stripWhitespaces=!0);e.datetimeAccessFormPaths=e.datetimeAccessFormPaths||[],void 0===e.useDoubleQuotes&&(e.useDoubleQuotes=!1);e.xmlElementsFilter=e.xmlElementsFilter||[],e.jsonPropertiesFilter=e.jsonPropertiesFilter||[],void 0===e.keepCData&&(e.keepCData=!1)}();var t=1,o=3,s=4,n=8,r=9;function a(e){var t=e.localName;return null==t&&(t=e.baseName),null!=t&&""!=t||(t=e.nodeName),t}function i(e,t,o,s){for(var n=0;n<e.length;n++){var r=e[n];if("string"==typeof r){if(r==s)break}else if(r instanceof RegExp){if(r.test(s))break}else if("function"==typeof r&&r(t,o,s))break}return n!=e.length}function l(t,o,s){if("property"===e.arrayAccessForm)t[o]instanceof Array?t[o+"_asArray"]=t[o]:t[o+"_asArray"]=[t[o]];!(t[o]instanceof Array)&&e.arrayAccessFormPaths.length>0&&i(e.arrayAccessFormPaths,t,o,s)&&(t[o]=[t[o]])}function d(t,o,s){if(e.datetimeAccessFormPaths.length>0){var n=s.split(".#")[0];return i(e.datetimeAccessFormPaths,t,o,n)?function(e){var t=e.split(/[-T:+Z]/g),o=new Date(t[0],t[1]-1,t[2]),s=t[5].split(".");if(o.setHours(t[3],t[4],s[0]),s.length>1&&o.setMilliseconds(s[1]),t[6]&&t[7]){var n=60*t[6]+Number(t[7]);n=0+("-"==(/\d\d-\d\d:\d\d$/.test(e)?"-":"+")?-1*n:n),o.setMinutes(o.getMinutes()-n-o.getTimezoneOffset())}else-1!==e.indexOf("Z",e.length-1)&&(o=new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes(),o.getSeconds(),o.getMilliseconds())));return o}(t):t}return t}function p(o,s,n,r){return!(s==t&&e.xmlElementsFilter.length>0)||i(e.xmlElementsFilter,o,n,r)}function u(i,c){if(i.nodeType==r){for(var _=new Object,m=i.childNodes,y=0;y<m.length;y++){if((P=m.item(y)).nodeType==t)_[f=a(P)]=u(P,f)}return _}if(i.nodeType==t){(_=new Object).__cnt=0;for(m=i.childNodes,y=0;y<m.length;y++){var P,f=a(P=m.item(y));if(P.nodeType!=n){var g=c+"."+f;p(_,P.nodeType,f,g)&&(_.__cnt++,null==_[f]?(_[f]=u(P,g),l(_,f,g)):(null!=_[f]&&(_[f]instanceof Array||(_[f]=[_[f]],l(_,f,g))),_[f][_[f].length]=u(P,g)))}}for(var T=0;T<i.attributes.length;T++){var S=i.attributes.item(T);_.__cnt++,_[e.attributePrefix+S.name]=S.value}var x=function(e){return e.prefix}(i);return null!=x&&""!=x&&(_.__cnt++,_.__prefix=x),null!=_["#text"]&&(_.__text=_["#text"],_.__text instanceof Array&&(_.__text=_.__text.join("\n")),e.stripWhitespaces&&(_.__text=_.__text.trim()),delete _["#text"],"property"==e.arrayAccessForm&&delete _["#text_asArray"],_.__text=d(_.__text,f,c+"."+f)),null!=_["#cdata-section"]&&(_.__cdata=_["#cdata-section"],delete _["#cdata-section"],"property"==e.arrayAccessForm&&delete _["#cdata-section_asArray"]),0==_.__cnt&&"text"==e.emptyNodeForm?_="":1==_.__cnt&&null!=_.__text?_=_.__text:1!=_.__cnt||null==_.__cdata||e.keepCData?_.__cnt>1&&null!=_.__text&&e.skipEmptyTextNodesForObj&&(e.stripWhitespaces&&""==_.__text||""==_.__text.trim())&&delete _.__text:_=_.__cdata,delete _.__cnt,!e.enableToStringFunc||null==_.__text&&null==_.__cdata||(_.toString=function(){return(null!=this.__text?this.__text:"")+(null!=this.__cdata?this.__cdata:"")}),_}if(i.nodeType==o||i.nodeType==s)return i.nodeValue}const c=function(e){return u(e)};return{xml_str2json:function(e){var t=function(e){var t,o=window.ActiveXObject||"ActiveXObject"in window;if(void 0===e)return null;if(window.DOMParser){var s=new window.DOMParser,n=null;if(!o)try{n=s.parseFromString("INVALID","text/xml").getElementsByTagName("parsererror")[0].namespaceURI}catch(e){n=null}try{t=s.parseFromString(e,"text/xml"),null!=n&&t.getElementsByTagNameNS(n,"parsererror").length>0&&(t=null)}catch(e){t=null}}else 0==e.indexOf("<?")&&(e=e.substr(e.indexOf("?>")+2)),(t=new ActiveXObject("Microsoft.XMLDOM")).async="false",t.loadXML(e);return t}(e);return null!=t?c(t):null}}})().xml_str2json,t=(e,t,o)=>new Promise(((s,n)=>{const r=new XMLHttpRequest;r.onreadystatechange=function(){if(4===r.readyState)if(200===r.status)s(JSON.parse(r.responseText));else{s({code:-2,msg:"登录异常！"})}},"get"!==e&&"GET"!==e||("object"==typeof o&&(o=Object.keys(o).map((function(e){return encodeURIComponent(e)+"="+encodeURIComponent(o[e])})).join("&")),t=o?t+"?"+o:t,r.open(e,t,!0),r.timeout=8e3,r.send()),"post"!==e&&"POST"!==e||(r.open(e,t,!0),r.setRequestHeader("Accept","*/*"),r.timeout=8e3,r.send(JSON.stringify(o)))})),o=(t,o,s)=>new Promise(((n,r)=>{const a=new XMLHttpRequest;a.onreadystatechange=function(){if(4===a.readyState)if(200===a.status){let t=e(a.responseText);n(t)}else r(a.status)},"post"!==t&&"POST"!==t||(a.open(t,o,!0),a.setRequestHeader("Accept","*/*"),a.send(JSON.stringify(s)))})),s="127.0.0.1:9585",n=`http://${s}/icvs2/`,r=`ws://${s}/`,a={subscriptionGps:e=>{let t=e.token,s=e.epid||"",r=e.puid||"",a=e.idx||0;return o("POST",n+"RawRequest?dstType=33&token="+t,{xml:'<?xml version="1.0" encoding="UTF-8"?><M Type="ComReq"><C Type="C" EPID="'+s+'"><Res Type="ST" Idx="'+a+'" OptID="C_GS_SubscribeGPSData"><Param></Param></Res></C><OSets><Res OType="201" OID="'+r+'" Type="GPS" Idx="'+a+'"></Res></OSets></M>'})},getPuidLastGps:e=>{let t=e.token,s=e.puid||[],r=e.epid||"",a="<OSets>";return a+='<Res OType="201" OID="'+s+'" Type="GPS" Idx="0"></Res>',a+="</OSets>",o("POST",n+'RawRequest?dstType=33&dstID=""&token='+t,{xml:'<?xml version="1.0" encoding="UTF-8"?><M Type="ComReq"><C Type="C" EPID="'+r+'"><Res Type="ST" Idx="0" OptID="C_GS_QueryLastGPSData"><Param></Param></Res></C>'+a+"</M>"})},getPuidHistoryGps:e=>{let t=e.token,s=e.offset||0,r=e.count||100,a=e.begin,i=e.end,l=e.puid,d=e.epid||"",p="<OSets>";return p+='<Res OType="201" OID="'+l+'" Type="ST" Idx="0"></Res>',p+="</OSets>",o("POST",n+'RawRequest?dstType=33&dstID=""&token='+t,{xml:'<?xml version="1.0" encoding="UTF-8"?><M Type="ComReq"><C Type="C" EPID="'+d+'"><Res Type="ST" Idx="0" OptID="C_GS_QueryHistoryGPSData"><Param  Offset="'+s+'" Count="'+r+'" Begin="'+a+'" End="'+i+'"></Param></Res></C>'+p+"</M>"})}},i={async getPresetPosList(e){let t={code:-1,rows:[]},s=e.idx||"0",r=e.puid||"",a=e.token||"",i=`${n}RawRequest?dstType=201&dstID=${r}&token=${a}`,l={xml:`<?xml version="1.0" encoding="UTF-8"?>\n    <M Type="ComReq">\n      <C Type="G" Prio="1" EPID="system" Lang="zh_CN">\n        <Res Type="PTZ" Idx="${s}" OptID="F_PTZ_PresetPositionSets" Stream="0"><Param></Param></Res>\n      </C>\n    </M>`},d=await o("post",i,l);try{t.rows=d.M.C.Res.Param.Preset,t.code=d.M.C._SPError}catch(e){t.msg="fail"}return t},setPresetPos:e=>t("post",`${n}PTZ/C_PTZ_SetPresetPos`,e),moveToPresetPos:e=>t("post",`${n}PTZ/C_PTZ_MoveToPresetPos`,e),gotoOriginalPresetPos:e=>t("post",`${n}PTZ/C_PTZ_GotoOriginalPresetPos`,e)},l={ptzControl:e=>{let o=e.puid||"",s=e.idx||0,r=e.control||"",a=e.speed||"",i="",l=e.token;if(o&&r){if("left"===r||"up"===r||"right"===r||"down"===r||"stop"===r){return t("post",`${n}PTZ/C_PTZ_Turn`,{puid:o,motion:r,idx:s,token:l,speed:a})}if("zoomin"===r){return t("post",`${n}PTZ/C_PTZ_ZoomInPicture`,{speed:a,puid:o,idx:s,token:l})}if("zoomout"===r){return t("post",`${n}PTZ/C_PTZ_ZoomOutPicture`,{speed:a,puid:o,idx:s,token:l})}if("stopzoom"===r){return t("post",`${n}PTZ/C_PTZ_StopPictureZoom`,{speed:a,puid:o,idx:s,token:l})}if("focusfar"===r){return t("post",`${n}PTZ/C_PTZ_MakeFocusFar`,{speed:a,puid:o,idx:s,token:l})}if("focusnear"===r){return t("post",`${n}PTZ/C_PTZ_MakeFocusNear`,{speed:a,puid:o,idx:s,token:l})}if("stopfocus"===r){return t("post",`${n}PTZ/C_PTZ_StopFocusMove`,{speed:a,puid:o,idx:s,token:l})}if("augment"===r){return i='<?xml version="1.0" encoding="UTF-8"?><M Type="ComReq"><C Type="G" Prio="1" EPID="system" Lang="zh_CN"> <Res Type="IV" Idx="'+s+'" OptID="C_PTZ_AugmentAperture" Stream="0"><Param></Param></Res></C></M>',QxRequestXML("post",`${n}RawRequest?dstType=201&dstID=${o}&token=${l}`,{xml:i})}if("minish"===r){return i='<?xml version="1.0" encoding="UTF-8"?><M Type="ComReq"><C Type="G" Prio="1" EPID="system" Lang="zh_CN"><Res Type="IV" Idx="'+s+'" OptID="C_PTZ_MinishAperture" Stream="0"><Param></Param></Res></C></M>',QxRequestXML("post",`${n}RawRequest?dstType=201&dstID=${o}&token=${l}`,{xml:i})}if("stopaperture"===r){return i='<?xml version="1.0" encoding="UTF-8"?><M Type="ComReq"><C Type="G" Prio="1" EPID="system" Lang="zh_CN"><Res Type="IV" Idx="'+s+'" OptID="C_PTZ_StopApertureZoom" Stream="0"><Param></Param></Res></C></M>',QxRequestXML("post",`${n}RawRequest?dstType=201&dstID=${o}&token=${l}`,{xml:i})}}}},d={startCloudSnapshot:e=>t("post",`${n}CSS/C_CSS_StartManualSnapshot`,e),startCloudStorage:e=>t("post",`${n}CSS/C_CSS_StartManualStorage`,e),stopCloudStorage:e=>t("post",`${n}CSS/C_CSS_StopManualStorage`,e),getCloudFile:e=>t("get",`${n}CSS/C_CSS_QueryStorageFiles`,e)},p={startSGSnapshot:e=>t("get",`${n}SG/C_SG_StartSnapshot`,e),startSGStorage:e=>(e.IVIdx=e.idx||"0",t("get",`${n}SG/VODFile.flv`,e)),getDeviceFile:e=>t("get",`${n}SG/C_SG_QueryRecordFiles`,e)},u={startLocalSnap:e=>{let o={playID:e.playID,localPath:e.localPath,count:e.count||1,interval:e.interval||6,token:e.token};return t("get",`${n}localSnapshot`,o)},stopLocalSnapShot:e=>t("get",`${n}cancelLocalSnapshot`,e),startLocalVideo:e=>{let o={playID:e.playID,localPath:e.localPath,maxFileTime:e.maxFileTime||300,token:e.token};return t("get",`${n}localRecord`,o)},stopLocalVideo:e=>t("get",`${n}cancelLocalRecord`,e)},c={downloadCloudFile:e=>t("get",`${n}downloadCloudFile2`,e),downloadDeviceFile:e=>t("get",`${n}downloadDeviceFile2`,e),setPuaseDownload:e=>t("get",`${n}puaseDownload2`,e),setRestoreDownload:e=>t("get",`${n}restoreDownload2`,e),setStopDownload:e=>t("get",`${n}stopDownload2`,e)},_={getVodDeviceFile:e=>t("get",`${n}vodDeviceFile2`,e),getVodCloudFile:e=>t("get",`${n}vodCloudFile2`,e),setPuaseVod:e=>t("get",`${n}puaseVod2`,e),setRestoreVod:e=>t("get",`${n}restoreVod2`,e),setSpeedVod:e=>t("get",`${n}setVodSpeed2`,e),setOffsetVod:e=>t("get",`${n}setVodOffset2`,e)},m={login:async(o,s)=>{let a={code:-1},i=await t("post",`${n}login`,o);if("OK"===i.msg){a.code=0,a.msg=i.msg,a.token=i.token;let t=r+"?token="+i.token,o=new WebSocket(t);o.onmessage=t=>{if("object"==typeof t&&t.data&&s){let o=e(t.data);if("PlayEvent"===o.Type){let e="";"1"===o.Status&&(e="连接中~"),"2"===o.Status&&(e="播放中~"),"3"===o.Status&&(e="播放完成~"),"4"===o.Status&&(e="播放失败~");let t={type:"playEvent",data:{status:o.Status,statusText:e,palyId:o.PlayID}};s(t)}let n=o.E||null;if(n)if("E_CU_Online"===n.ID){let e={type:"userOnline",data:{UserID:n.Desc.UserID,EPID:n.Desc.EPID}};s(e)}else if("E_CU_Offline"===n.ID){let e={type:"userOffline",data:{UserID:n.Desc.UserID,EPID:n.Desc.EPID}};s(e)}else"E_PU_Online"===n.ID||"E_PU_Offline"===n.ID||"PlayNtf"===n.ID&&(console.log("playNtf"),console.log(n))}},o.onclose=()=>{s({type:"WsClose"})},o.onerror=function(){s({type:"WsError"})}}else a=i;return a},getDeviceList:e=>t("get",`${n}CAS/C_CAS_QueryPUIDSets`,e),getDeviceByPuid:e=>t("get",`${n}C_CAS_QueryPUIDRes`,e),getPlayVideoId:e=>t("get",`${n}video/startVideo2`,e),startTalk:e=>t("get",`${n}audio/startTalk2`,e),startCall:e=>t("get",`${n}audio/startCall2`,e),stoptStream:e=>t("get",`${n}stopPlay2`,e),enablePlayAudio:e=>t("get",`${n}enablePlayAudio`,e)};return Object.assign(m,a,i,l,d,p,u,c,_)}));
