import {selectReport} from '../lib/records.mjs';
// Kept on the server. Never return the raw feed or another seller’s row.
const source='https://docs.google.com/spreadsheets/d/e/2PACX-1vSBWbtZIjZjY5Fkuny3RXIlpXupbIDt4Ib4AHO6-Mf9bUUCugidlncZ-eO2tzpUD-l2WGLy9MMmuSID/pub?gid=0&single=true&output=csv';
export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='POST'){res.statusCode=405;res.setHeader('Allow','POST');res.end();return}
 try{
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
  if(!body||typeof body.address!=='string'||typeof body.code!=='string'||!body.address.trim()||!body.code||body.address.length>200||body.code.length>200){res.statusCode=400;res.end(JSON.stringify({error:'Enter your address and access code.'}));return}
  const response=await fetch(process.env.SELLER_SHEET_CSV_URL||source,{signal:AbortSignal.timeout(12000),cache:'no-store'});
  if(!response.ok)throw Error('Source unavailable');
  const report=selectReport(await response.text(),body.address,body.code);
  res.setHeader('Content-Type','application/json');res.statusCode=report?200:401;res.end(JSON.stringify(report||{error:'Address or access code not recognized.'}));
 }catch{res.statusCode=503;res.end(JSON.stringify({error:'The report is temporarily unavailable. Please try again.'}))}
}
