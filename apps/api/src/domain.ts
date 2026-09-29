export type PassportStatus = 'STABLE' | 'ATTENTION_REQUIRED' | 'REVIEW_REQUIRED';
export type ProductEventType = 'GUARANTEE_CREATED'|'SOURCE_ASSOCIATED'|'CHECK_REQUESTED'|'CHANGE_OBSERVED'|'REVIEW_REQUIRED'|'HUMAN_REVIEW_RECORDED';
export type ProductEvent = { id:string; passportId:string; tenantId:string; type:ProductEventType; at:string; detail:string; actor:string };
export type Passport = { id:string; tenantId:string; assetName:string; guaranteeRef:string; decisionBasis:string; status:PassportStatus; statusLabel:string; lastCheckedAt:string; checks:number; sources:number; changes:number; reviewsRequired:number; createdAt:string; observations:{id:string; at:string; title:string; detail:string; severity:'info'|'attention'|'review'}[]; events:ProductEvent[]; integration:{evidence:'live'|'unavailable'; foundry:'live'|'unavailable'; studio:'pattern-only'} };

export const fixture = (tenantId:string, id='gp-001'):Passport => ({
  id, tenantId, assetName:'Rural Property Guarantee', guaranteeRef:'GP-001', decisionBasis:'Credit approval backed by rural property', status:'REVIEW_REQUIRED', statusLabel:'Review required', lastCheckedAt:'2026-09-29T12:00:00.000Z', checks:2, sources:2, changes:1, reviewsRequired:1, createdAt:'2026-09-27T12:00:00.000Z',
  observations:[{id:'obs-1',at:'2026-09-27T12:00:00.000Z',title:'Passport created',detail:'Initial guarantee state recorded as stable for the original credit decision.',severity:'info'},{id:'obs-2',at:'2026-09-29T12:00:00.000Z',title:'Registry condition changed',detail:'A new environmental or registry condition was observed. Material impact is not yet established.',severity:'review'}], events:[], integration:{evidence:'unavailable',foundry:'unavailable',studio:'pattern-only'}
});
