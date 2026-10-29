import {selectReport} from '../lib/records.mjs';
// Kept on the server. Never return the raw feed or another seller’s row.
const source='https://docs.google.com/spreadsheets/d/e/2PACX-1vSBWbtZIjZjY5Fkuny3RXIlpXupbIDt4Ib4AHO6-Mf9bUUCugidlncZ-eO2tzpUD-l2WGLy9MMmuSID/pub?gid=0&single=true&output=csv';
// Supplemental sections live in hosting configuration, never in the public sheet or assets.
export function supplement(report,raw){
 if(!report||!raw)return report;
 const sections=JSON.parse(raw);
 const extra=sections[report.propertyId];
 if(!extra)return report;
 const out={...report};
 for(const key of ['photoUrl','feedback','competitors','activities','campaigns','marketSource']){
  if(extra[key]!==undefined)out[key]=extra[key];
 }
 out.executiveSummary=`Review current buyer activity and next steps below. Supporting market and feedback sections were last reviewed ${extra.sectionAsOf}.`;
 const shortDate=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',timeZone:'UTC'}).format(new Date(extra.sectionAsOf+'T12:00:00Z'));
 const fullDate=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(extra.sectionAsOf+'T12:00:00Z'));
 if(report.reportDate===extra.sectionAsOf||report.reportDate===shortDate||report.reportDate===fullDate){
  out.reportDate=report.reportDate;
  out.metrics=report.metrics.map(metric=>{
   const info=extra.metrics?.find(m=>m.platform===metric.platform)||{};
   const result={...metric};
   for(const key of ['period','basis','collectedAt','source','previous','freshness'])if(info[key]!==undefined)result[key]=info[key];
   return result;
  });
  for(const key of ['showingsAsOf','openHousesAsOf','showingNote'])if(extra[key]!==undefined)out[key]=extra[key];
 }
 return out;
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='POST'){res.statusCode=405;res.setHeader('Allow','POST');res.end();return}
 try{
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
  if(!body||typeof body.address!=='string'||typeof body.code!=='string'||!body.address.trim()||!body.code||body.address.length>200||body.code.length>200){res.statusCode=400;res.end(JSON.stringify({error:'Enter your address and access code.'}));return}
  const response=await fetch(process.env.SELLER_SHEET_CSV_URL||source,{signal:AbortSignal.timeout(12000),cache:'no-store'});
  if(!response.ok)throw Error('Source unavailable');
  const report=supplement(selectReport(await response.text(),body.address,body.code),process.env.SELLER_REPORT_SECTIONS_JSON);
  res.setHeader('Content-Type','application/json');res.statusCode=report?200:401;res.end(JSON.stringify(report||{error:'Address or access code not recognized.'}));
 }catch{res.statusCode=503;res.end(JSON.stringify({error:'The report is temporarily unavailable. Please try again.'}))}
}
