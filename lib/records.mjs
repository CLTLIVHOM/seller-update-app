import {number} from '../workflow.mjs';
export function parseCSV(text){const out=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted}else if(c===','&&!quoted){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))out.push(row);row=[];cell=''}else cell+=c}if(quoted)throw Error('Malformed CSV');row.push(cell);if(row.some(v=>v.trim()))out.push(row);return out}
const normalize=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'');
export function selectReport(csv,address,code){
 const [headers,...rows]=parseCSV(csv);if(!headers)throw Error('Missing headers');
 const map=Object.fromEntries(headers.map((v,i)=>[normalize(v),i]));
 const field=(r,...names)=>{for(const n of names){const i=map[normalize(n)];if(i!==undefined)return String(r[i]??'').trim()}return ''};
 if(map.address===undefined&&map.propertyaddress===undefined)throw Error('Missing address column');
 const matches=rows.filter(r=>normalize(field(r,'Address','Property Address'))===normalize(address)&&field(r,'Password','Access Code')===String(code));
 if(!matches.length)return null;
 // Preserve the original append-only sheet convention: last matching row is latest.
 const r=matches.at(-1);const get=(...names)=>field(r,...names);
 const list=name=>{const raw=get(name);if(!raw)return [];const data=JSON.parse(raw);if(!Array.isArray(data))throw Error('Invalid '+name);return data};
 const metric=(platform,key)=>({platform,views:number(get('Views - '+key)),saves:number(get('Saves - '+key)),period:get('Period - '+key)||'Reporting window not yet confirmed',basis:get('Basis - '+key)||null,collectedAt:get('Collected - '+key)||null,source:get('Source - '+key)||null,url:get('Link - '+key)});
 const date=get('Last Updated','Date','Update Date');
 const showingFields={showingsThisWeek:number(get('Showings This Week')),showingsPeriodStart:get('Showings Period Start'),showingsPeriodEnd:get('Showings Period End'),lastCompletedShowing:get('Last Completed Showing'),showingSource:get('Showing Source'),showingNote:get('Showing Note')};
 return {...showingFields,propertyId:get('Property ID')||normalize(get('Address')),address:get('Address','Property Address'),reportDate:date,status:get('Status'),photoUrl:get('Listing Photo URL'),dom:number(get('DOM','Days on Market')),showings:number(get('Total Showings')),openHouses:number(get('Total Open Houses')),executiveSummary:get('Executive Summary')||'Review buyer activity, feedback, and the next steps for your listing below.',kristensTake:get("Kristen's Strategic Read","Kristen's Take"),nextSteps:get("What's Happening Next"),loving:get('What Buyers Are Loving'),concerns:get('What Buyers Are Concerned About'),marketContext:get('Market Context'),metrics:[metric('Realtor.com','Realtor'),metric('Redfin','Redfin'),metric('Homes.com','Homes'),metric('Zillow','Zillow'),metric('MLS','MLS')],campaigns:list('Campaigns JSON'),feedback:list('Feedback JSON'),competitors:list('Competitors JSON'),activities:list('Activities JSON')};
}
