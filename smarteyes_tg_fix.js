let sessionKey = document.cookie.split(';').find(c => c.indexOf('tgSessionKey')>-1).replace('tgSessionKey=','').trim();
let date = document.querySelector('[name=event_dint]').value;
let prj = document.querySelector('[name=prj_ID]').value;

let d = document.createElement('div');
d.innerHTML = '<p><label>Medarbejder:&nbsp;&nbsp;&nbsp;<select name="smarteyestgfix_res"></select></label></p><p style="margin-top:20px;text-align:right"><input id="smarteyestgfix_cancel" type="button" value="Annuller" />&nbsp;<input id="smarteyestgfix_submit" type="button" value="Udfør" /></p>';
d.id = 'smarteyestgfix';
d.style.position='fixed';
d.style.minWidth='20vw';
d.style.minHeight='20vh';
d.style.border='solid 1px black';
d.style.background='white';
d.style.borderRadius='10px';
d.style.boxShadow='2px 3px 10px rgba(0,0,0,0.2)';
d.style.left='40vw';
d.style.top='30vh';
d.style.padding='10px';
d.style.zIndex=99999;
document.body.appendChild(d);

let resourceResponse = await fetch('https://smarteyesdk.timegrip.com/srvcomm.php?'+(new Date().getTime()),
{method:'POST',credentials:'include',headers:{'Content-Type': 'application/x-www-form-urlencoded','Content-encoding':'UTF-8'},    
body: new URLSearchParams({
'json': JSON.stringify({'itm_ID':-1,'cust_ID':-1,'prj_ID':prj,'res_ID':13815,'serviceArtCode':'O5','eventDint':date, 'eventHour':9, 'eventMinute':30, 'eventLength': 15, 'bIsEditDialog':true}),
'srvFn': 'booking.getAvailableBookingResources',
'tgSessionKey': urlDecode(sessionKey)})
});
const resourceJsonData = await resourceResponse.json();

for (let resource of resourceJsonData.data.availableResources) {
let option = document.createElement('option');
option.value=resource.res_ID;
option.innerHTML=resource.fullname;
document.querySelector('[name=smarteyestgfix_res]').appendChild(option);
}
document.getElementById('smarteyestgfix_cancel').onclick = async function () {
document.getElementById('smarteyestgfix').remove();
};
document.getElementById('smarteyestgfix_submit').onclick = async function () {
let res = document.querySelector('[name=smarteyestgfix_res]').value;

if (!res || !sessionKey || !date || !prj || prj.length !== 3 || res.length !== 5) {alert('Nope! Something wrong with variables.');}
else {
for(let t of ['09:45','10:15','10:45','11:15','11:45','12:15','12:45','13:15','13:45','14:15','14:45','15:15','15:45','16:15','16:45','17:15']) {
await fetch('https://smarteyesdk.timegrip.com/srvcomm.php?'+(new Date().getTime()),
{method:'POST',credentials:'include',headers:{'Content-Type': 'application/x-www-form-urlencoded'},    
body: new URLSearchParams({
'json': JSON.stringify({'itm_ID':-1,'cust_ID':-1,'prj_ID':prj,'res_ID':res,'serviceArtCode':'O5','eventDint':date,'eventTime':t,'serviceLength':15,'description':'','wfs_ID':90,'forcePublicMode':0}),
'srvFn': 'booking.bookService',
'tgSessionKey': urlDecode(sessionKey)})
});
}
} 
document.getElementById('smarteyestgfix').remove();
window.location.reload();
};
