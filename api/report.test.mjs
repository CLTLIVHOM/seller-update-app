import test from 'node:test';
import assert from 'node:assert/strict';
import {supplement} from './report.mjs';
const base={propertyId:'12oakrd',reportDate:'October 19',showings:13,openHouses:10,metrics:[{platform:'Zillow',views:293,saves:11}]};
const extra=JSON.stringify({'12oakrd':{sectionAsOf:'2026-10-19',showings:2,code:'never-return',competitors:[{address:'14 Oak Rd'}],metrics:[{platform:'Zillow',views:1,collectedAt:'2026-10-19'}]}});
test('supplements preserve current totals and metric values',()=>{const r=supplement(base,extra);assert.equal(r.showings,13);assert.equal(r.openHouses,10);assert.equal(r.metrics[0].views,293);assert.equal(r.metrics[0].saves,11);assert.equal(r.competitors.length,1);assert.equal(r.reportDate,'2026-10-19');assert.equal(r.code,undefined)});
test('missing or mismatched listings never receive another report',()=>{assert.equal(supplement(null,extra),null);assert.equal(supplement({...base,propertyId:'other'},extra).competitors,undefined)});
test('new reporting dates never inherit old collection dates',()=>{const r=supplement({...base,reportDate:'October 26'},extra);assert.equal(r.metrics[0].collectedAt,undefined);assert.equal(r.reportDate,'October 26');assert.match(r.executiveSummary,/2026-10-19/)});
