import {selectReport} from './lib/records.mjs';
const norm=v=>String(v??'').toLowerCase().replace(/[^a-z0-9]/g,'');
const csv=rows=>rows.map(r=>r.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\n');
export function registryReports(values){
 if(!Array.isArray(values)||!values.length)throw Error('The listing registry is empty');
 const headers=values[0],map=Object.fromEntries(headers.map((h,i)=>[norm(h),i]));
 const addr=map.address??map.propertyaddress,code=map.password??map.accesscode,status=map.status;
 if(addr===undefined||code===undefined||status===undefined)throw Error('Registry requires Address, Status, and Access Code or Password columns');
 const rows=values.slice(1).filter(r=>String(r[addr]??'').trim());
 const seen=new Set(),reports=[],skipped=[],issues=[];
 for(const row of [...rows].reverse()){
  const key=norm(row[addr]);if(seen.has(key))continue;seen.add(key);
  const state=String(row[status]??'').trim();
  if(state.toLowerCase()!=='active'){skipped.push({address:String(row[addr]).trim(),status:state||'Missing'});continue}
  if(!String(row[code]??'').trim()){issues.push({address:String(row[addr]).trim(),issue:'Add a seller access code before the report can be published.'});continue}
  try {
   const report=selectReport(csv([headers,row]),row[addr],String(row[code]));report.status='Active';reports.push(report);
  } catch {
   issues.push({address:String(row[addr]).trim(),issue:'This row has invalid data. Correct its inputs; other listings can continue.'});
  }
 }
 return {reports,skipped,issues};
}
export function mergeRetainedReport(current,retained){
 if(!retained||norm(current.address)!==norm(retained.address))return current;
 // Retained evidence keeps its source dates. The live sheet owns listing status and links.
 const metrics=current.metrics.map(m=>{
  const old=retained.metrics?.find(v=>v.platform===m.platform);
  return old?{...old,url:m.url||old.url}:m;
 });
 return {...current,...retained,address:current.address,status:current.status,metrics};
}
