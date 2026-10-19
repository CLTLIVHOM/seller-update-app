import fs from 'node:fs/promises';
import path from 'node:path';
import {prepareUpdate} from './workflow.mjs';
import {registryReports,mergeRetainedReport} from './registry.mjs';
const [input,asOf]=process.argv.slice(2);
if(!input||!asOf){console.error('Usage: npm run update -- /private/path/input.json YYYY-MM-DD');process.exit(1);}
let source=JSON.parse(await fs.readFile(input,'utf8'));
if(Array.isArray(source[0])){
 const registry=registryReports(source);
 let retained;try{retained=JSON.parse(await fs.readFile(new URL('./preview.json',import.meta.url),'utf8'))}catch(error){if(error.code!=='ENOENT')throw error}
 source=registry.reports.map(r=>mergeRetainedReport(r,retained));
 for(const skipped of registry.skipped)console.log(`Skipped ${skipped.address}: ${skipped.status}`);
 for(const issue of registry.issues)console.log(`SETUP ${issue.address}: ${issue.issue}`);
}
const prepared=source.filter(r=>r.status==='Active').map(r=>prepareUpdate(r,asOf));
if(!prepared.length)console.log('No Active listings found. Confirm the current sheet statuses before continuing.');
const dir=path.resolve('private-drafts',asOf);await fs.mkdir(dir,{recursive:true});
for(const result of prepared){
 const id=String(result.draft.propertyId);if(!/^[a-zA-Z0-9_-]+$/.test(id))throw new Error('Use a stable alphanumeric property ID');
 const history=path.resolve('private-drafts/history',id);await fs.mkdir(history,{recursive:true});
 try{await fs.writeFile(path.join(history,asOf+'-first-draft.json'),JSON.stringify(result,null,2),{mode:0o600,flag:'wx'})}catch(error){if(error.code!=='EEXIST')throw error}
 await fs.writeFile(path.join(dir,id+'.json'),JSON.stringify(result,null,2),{mode:0o600});
 console.log(result.draft.address);for(const q of result.questions)console.log('INPUT: '+q);for(const w of result.warnings)console.log('CHECK: '+w);
 console.log(result.draft.publishReady?'Ready for review.':'Draft saved; inputs or checks remain.');
}
console.log('No live sheet or website was changed.');
