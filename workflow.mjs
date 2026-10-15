export const platforms=['Realtor.com','Redfin','Homes.com','Zillow','MLS'];
export function number(value){if(value===null||value===undefined||String(value).trim()==='')return null;const n=Number(String(value).replaceAll(',',''));if(!Number.isFinite(n)||n<0)throw new Error('Metrics must be nonnegative numbers');return n;}
export function validDate(value){const d=new Date(value+'T00:00:00Z');return /^\d{4}-\d{2}-\d{2}$/.test(value||'')&&Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value;}
export function prepareUpdate(report,asOf){
 if(!validDate(asOf))throw new Error('A valid reporting date is required');
 if(!report.propertyId||!report.address)throw new Error('Property ID and address are required');
 const questions=[],warnings=[];const draft=structuredClone(report);
 if(!['Active','Under Contract','Closed','Paused'].includes(report.status))questions.push('Confirm the current listing status.');
 if(!report.kristensTake?.trim()||report.takeReviewedAt!==asOf)questions.push("Add or confirm Kristen’s Take for this update: what does this week’s evidence mean, and what do you recommend?");
 if(!report.nextSteps?.trim()||report.nextStepsReviewedAt!==asOf)questions.push('Confirm next steps for the coming week.');
 if(report.propertyReviewedAt!==asOf||report.dom==null)questions.push('Confirm current listing status, days on market, and sale versus rental listing.');
 if(!report.photoUrl)questions.push('Add the approved main listing photo.');
 if(!report.competitors?.length)questions.push('Provide an initial neighborhood CMA or selected competing-property links.');
 const metrics=draft.metrics||[];
 if(new Set(metrics.map(m=>m.platform)).size!==metrics.length)throw new Error('Duplicate platform metrics');
 for(const platform of platforms){
  const m=metrics.find(m=>m.platform===platform);
  if(!m){questions.push(`Provide ${platform} views/saves or confirm they are unavailable.`);continue;}
  m.views=number(m.views);m.saves=number(m.saves);
  if(!m.url)questions.push(`Add or confirm the ${platform==='MLS'?'MLS seller report':platform+' listing'} link for this property.`);
  if(!m.source||!validDate(m.collectedAt)||!m.period||!['cumulative','rolling','period'].includes(m.basis))questions.push(`Confirm ${platform} source, collection date, reporting window, and metric basis.`);
  if(m.collectedAt&&validDate(m.collectedAt)){
   if(m.collectedAt>asOf)questions.push(`${platform} collection date is after the report date; correct it.`);
   else if((Date.parse(asOf)-Date.parse(m.collectedAt))/86400000>7)warnings.push(`${platform} data is more than seven days old.`);
  }
  if(m.views===null||m.saves===null)warnings.push(`${platform} has unavailable metrics; do not substitute zero.`);
 }
 if(!report.feedbackReviewedAt||!validDate(report.feedbackReviewedAt)||report.feedbackReviewedAt!==asOf)questions.push('Confirm showing totals, cancellations, and feedback for this update.');
 if(!report.marketingReviewedAt||!validDate(report.marketingReviewedAt)||report.marketingReviewedAt!==asOf)questions.push('Confirm completed marketing and campaign results for this update.');
 if(!report.marketReviewedAt||!validDate(report.marketReviewedAt)||report.marketReviewedAt!==asOf)questions.push('Review the selected competing listings and market context.');
 draft.reportDate=asOf;draft.metrics=metrics;draft.publishReady=questions.length===0&&warnings.length===0;
 return {draft,questions,warnings};
}
export function metricChange(current,previous,key){
 if(!previous||current.platform!==previous.platform||current.basis!==previous.basis)return null;
 if(!validDate(current.collectedAt)||!validDate(previous.collectedAt)||current.collectedAt<=previous.collectedAt)return null;
 if(current.basis!=='cumulative'||!current.period||current.period!==previous.period||!current.source||current.source!==previous.source)return null;
 const a=number(current[key]),b=number(previous[key]);return a===null||b===null?null:{value:a-b,label:'Change in reported total'};
}
export function showingSummary(report){
 const asOf=report.reportDate,last=report.lastCompletedShowing;
 const days=validDate(asOf)&&validDate(last)&&last<=asOf?Math.round((Date.parse(asOf)-Date.parse(last))/86400000):null;
 const weekly=report.showingsThisWeek===null||report.showingsThisWeek===undefined?null:number(report.showingsThisWeek);
 const period=validDate(report.showingsPeriodStart)&&validDate(report.showingsPeriodEnd)&&report.showingsPeriodStart<=report.showingsPeriodEnd&&report.showingsPeriodEnd<=asOf;
 return {weekly:period?weekly:null,days,last:days===null?null:last,quiet:days!==null&&days>=21};
}
