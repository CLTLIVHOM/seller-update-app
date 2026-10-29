import {prepareUpdate,showingSummary,metricChange} from './workflow.mjs';
let data;
const $=id=>document.getElementById(id);const text=(id,v)=>$(id).textContent=v||'Not yet provided';
const num=v=>v===null||v===undefined?'Unavailable':Number(v).toLocaleString();
const el=(tag,content,cls)=>{const n=document.createElement(tag);if(content!==undefined)n.textContent=content;if(cls)n.className=cls;return n};
function safeLink(url,label){try{const u=new URL(url);if(u.protocol!=='https:')return null;const a=el('a',label);a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';return a}catch{return null}}
function empty(id,message){$(id).append(el('div',message,'empty'))}
function addPerformanceHistory(card,metric){
 if(metric.freshness)card.append(el('p',metric.freshness,'period'));
 if(metric.previous?.comparisonType==='reported-snapshot'){
  const previous=metric.previous;
  card.append(el('p',`Monday ${previous.collectedAt} → Thursday ${metric.collectedAt}`,'period'));
  for(const [key,label] of [['views','Views'],['saves','Saves / favorites']]){
   const current=metric[key],baseline=previous[key];
   if(current==null||baseline==null){card.append(el('p',label+': unavailable','weekly-change'));continue;}
   const difference=current-baseline;
   const signed=difference>0?'+':'';
   const percent=baseline===0?'percentage unavailable':signed+(difference/baseline*100).toFixed(2)+'%';
   card.append(el('p',`${label}: ${num(baseline)} → ${num(current)} · ${signed}${numSigned(difference)} (${percent})`,'weekly-change'));
  }
  card.append(el('p','Change in reported snapshots, not unique buyers.','period'));
  return;
 }
 if(metric.previous)card.append(el('p',`Previously reported ${metric.previous.collectedAt}: ${num(metric.previous.views)} views · ${num(metric.previous.saves)} saves / favorites`,'period'));
 const changes=['views','saves'].map(key=>{const d=metricChange(metric,metric.previous,key);return d?`${key==='views'?'Views':'Saves'}: ${d.value>0?'+':''}${numSigned(d.value)}`:null}).filter(Boolean);
 card.append(el('p',changes.length?`${changes.join(' · ')} since ${metric.previous.collectedAt}. Change in reported totals, not unique buyers.`:'Weekly change: awaiting the next comparable update.','weekly-change'));
}
function addPlatformLogo(card,platform){
 const domains={'Zillow':'zillow.com','Redfin':'redfin.com','Realtor.com':'realtor.com','Homes.com':'homes.com','MLS':'listtrac.com'};
 if(!domains[platform])return;
 const img=el('img');img.className='platform-logo';img.alt=(platform==='MLS'?'ListTrac':platform)+' logo';img.src='https://www.google.com/s2/favicons?domain='+domains[platform]+'&sz=64';img.referrerPolicy='no-referrer';img.addEventListener('error',()=>img.remove(),{once:true});card.prepend(img);
}
function numSigned(v){return Number(v).toLocaleString()}
function addListingPhoto(card,listing){
 if(!listing.photoUrl)return;
 const checked=safeLink(listing.photoUrl,'');if(!checked)return;
 const img=el('img');img.src=checked.href;img.alt='Listing photo of '+listing.address;img.decoding='async';img.className='competitor-photo';img.referrerPolicy='no-referrer';
 img.addEventListener('error',()=>img.replaceWith(el('p','Photo unavailable. Open the listing below to view photos.','muted')),{once:true});
 const link=safeLink(listing.url,'');if(link){link.setAttribute('aria-label','View photos and details for '+listing.address);link.append(img);card.append(link)}else card.append(img);
 card.append(el('p','Listing photo · '+(listing.photoSource||'Public listing'),'period'));
}
function render(report){data=report;
for(const id of ['stats','platforms','campaign-list','feedback-list','competitor-list','activity-list','showing-stats'])$(id).replaceChildren();
text('address',data.address);text('status',data.status);text('date','Updated '+data.reportDate);text('executive',data.executiveSummary);text('take',data.kristensTake);text('loving',data.loving);text('concerns',data.concerns);text('market-summary',data.marketContext);text('next',data.nextSteps);
if(data.photoUrl){try{const u=new URL(data.photoUrl);if(u.protocol==='https:'){const img=el('img');img.src=u.href;img.alt=data.address;$('photo').replaceChildren(img);$('photo').classList.add('has-image')}}catch{}}
for(const [label,value,date]of [[data.domLabel||'Days on market',data.dom,null],['Total showings',data.showings,data.showingsAsOf],['Open houses',data.openHouses,data.openHousesAsOf]]){const card=el('div',undefined,'stat');card.append(el('strong',num(value)),el('span',label));if(date)card.append(el('div','Last reported '+date,'period'));$('stats').append(card)}
for(const m of data.metrics){const c=el('article',undefined,'platform');addPlatformLogo(c,m.platform);c.append(el('h3',m.platform==='MLS'?'MLS / ListTrac':m.platform));const row=el('div',undefined,'metrics');for(const [k,label]of [['views','Views'],['saves','Saves / favorites']]){const n=el('div');n.append(el('strong',num(m[k])),el('small',label));row.append(n)}c.append(row,el('div',m.period||'Reporting window needs confirmation','period'),el('div',m.collectedAt?'Collected '+m.collectedAt:'Collection date needs confirmation','period'));addPerformanceHistory(c,m);const a=safeLink(m.url,m.platform==='MLS'?'View MLS update ↗':'View listing ↗');if(a)c.append(a);$('platforms').append(c)}
function items(id,values,render,missing){if(!values?.length){empty(id,missing);return}for(const v of values){const c=el('article');render(c,v);$(id).append(c)}}
const channelLabels={'organic':'Organic social','paid':'Meta paid ads','bhhs':'BHHS promotions','membership':'Homes.com membership'};
for(const [channel,label] of Object.entries(channelLabels)){
 const group=el('div',undefined,'campaign-group');group.append(el('h3',label));
 const campaigns=(data.campaigns||[]).filter(v=>v.channel===channel&&v.propertyId===data.propertyId);
 if(!campaigns.length)group.append(el('p',channel==='membership'?'Membership-supported exposure. Listing results are shown when available; no per-listing spend is assigned.':'No listing-specific results have been added for this update.','muted'));
 for(const v of campaigns){const card=el('article');card.append(el('h3',v.title),el('p',v.description));if(v.imageUrl){const link=safeLink(v.imageUrl,'');if(link){const img=el('img');img.src=link.href;img.alt=v.title;img.loading='lazy';card.append(img)}}if(v.startDate||v.endDate)card.append(el('p',[v.startDate,v.endDate].filter(Boolean).join(' – '),'period'));const parts=[];for(const [key,name]of [['impressions','Impressions'],['reach','Reported reach'],['linkClicks','Link clicks'],['inquiries','Inquiries']])if(v[key]!==null&&v[key]!==undefined)parts.push(`${name}: ${num(v[key])}`);if(v.spend!==null&&v.spend!==undefined&&v.currency)parts.push(`Spend: ${v.currency} ${num(v.spend)}`);if(parts.length)card.append(el('p',parts.join(' · ')));if(v.metricPeriod)card.append(el('p',v.metricPeriod,'period'));const a=safeLink(v.url,'View promotion ↗');if(a)card.append(a);group.append(card)}$('campaign-list').append(group);
}
const shows=showingSummary(data);
for(const [label,value]of [['Showings this week',num(shows.weekly)],['Last completed showing',shows.last||'Date to confirm'],['Days since last showing',num(shows.days)]]){const card=el('div',undefined,'stat');card.append(el('strong',value),el('span',label));$('showing-stats').append(card)}
text('showing-period',shows.weekly===null?'Weekly showing count and last completed showing date need confirmation.':`${data.showingsPeriodStart} to ${data.showingsPeriodEnd} · ${data.showingSource||'Source to confirm'}`);
const quiet=data.showingNote||(shows.quiet?'No completed showings for at least three weeks. Review price, presentation, competing listings, and the next action with Kristen.':'');$('quiet-note').hidden=!quiet;text('quiet-note',quiet);
items('feedback-list',data.feedback,(c,v)=>c.append(el('h3',v.date+' · '+v.outcome),el('p',v.feedback)),'No dated showing history is available in this export. Existing weekly comments are preserved above.');
const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v);
items('competitor-list',data.competitors,(c,v)=>{addListingPhoto(c,v);c.append(el('span',v.status||'Status to confirm','pill'),el('h3',v.address));c.append(el('p',v.status==='Closed'?`Sold ${v.closePrice==null?'price to confirm':money(v.closePrice)} · Listed ${v.price==null?'price to confirm':money(v.price)}`:`Asking ${v.price==null?'price to confirm':money(v.price)}`));if(v.sqft)c.append(el('p',`${v.beds} bedrooms · ${v.baths} baths · ${num(v.sqft)} heated sq ft · ${v.acres} acres`,'muted'));c.append(el('p',v.relevance));if(v.dom!=null)c.append(el('p',`${num(v.dom)} ${v.domLabel?v.domLabel.toLowerCase():'days on market'}`));if(v.closeDate)c.append(el('p','Closed '+v.closeDate));if(v.sellerConcessions!=null)c.append(el('p','Reported seller concessions: '+money(v.sellerConcessions),'period'));if(v.priceChange)c.append(el('p',v.priceChange));if(v.checkedAt)c.append(el('p',`MLS ${v.mlsId||''} · Checked ${v.checkedAt}`,'period'));const a=safeLink(v.url,'View property ↗');if(a)c.append(a)},'Selected competing properties will appear here after the current market comparison is reviewed.');
if(data.marketSource)$('competitor-list').append(el('p',data.marketSource,'footnote'));
items('activity-list',data.activities,(c,v)=>c.append(el('h3',v.date+' · '+v.title),el('p',v.detail)),'No dated activity log is available yet. Completed work will be recorded here with dates and supporting links.');
$('login').hidden=true;$('report').hidden=false;document.querySelector('nav').hidden=false;
}
const params=new URLSearchParams(location.search);
if(params.get('preview')==='1'){
 try{render(await fetch('./preview.json').then(r=>{if(!r.ok)throw Error();return r.json()}));document.querySelector('.preview').hidden=false;if(params.get('view')==='prepare'){$('report').hidden=true;$('prepare').hidden=false}}
 catch{text('login-error','Local preview data is unavailable. Please sign in to view your report.')}
}
$('login-form').addEventListener('submit',async e=>{e.preventDefault();const button=e.currentTarget.querySelector('button');button.disabled=true;text('login-error','Loading your update…');try{const r=await fetch('/api/report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({address:$('address-input').value,code:$('code-input').value})});const body=await r.json();if(!r.ok)throw Error(body.error||'Unable to load report');render(body);$('code-input').value='';text('login-error',' ')}catch(error){text('login-error',error.message)}finally{button.disabled=false}});
$('logout').addEventListener('click',()=>location.replace(location.pathname));
$('run').addEventListener('click',()=>{const asOf=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const result=prepareUpdate(data,asOf);$('readiness').replaceChildren(el('h2','Inputs needed for '+data.address));for(const [label,values]of [['Please add or confirm',result.questions],['Source checks',result.warnings]]){if(!values.length)continue;$('readiness').append(el('h3',label));const ul=el('ul');values.forEach(v=>ul.append(el('li',v)));$('readiness').append(ul)}});
