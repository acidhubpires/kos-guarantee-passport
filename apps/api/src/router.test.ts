import {describe,expect,it} from 'vitest';
import {fixture} from './domain.js';
import {routeGuaranteeQuestion} from './router.js';

const p=fixture('tenant-a');
describe('bounded Guarantee Passport capability router',()=>{
  it.each([
    ['qual o status','CURRENT_STATUS'],['me explique o contexto da garantia','GUARANTEE_CONTEXT_SYNTHESIS'],['o que mudou?','RECENT_CHANGE'],
    ['por que precisa de revisão?','REVIEW_REQUIREMENT'],['quem precisa decidir?','REVIEW_REQUIREMENT'],['o que não sabemos?','MISSING_KNOWLEDGE'],
    ['quais são as fontes?','SUPPORTING_SOURCES'],['quando foi verificada?','FRESHNESS'],['me mostre o histórico','TIMELINE'],
    ['o que é este chat?','CONVERSATION_CONTEXT'],['dólar amanhã?','OUT_OF_SCOPE']
  ])('%s routes to %s', (question,capability)=>expect(routeGuaranteeQuestion(question,p).capability).toBe(capability));
  it('answers current status without converting review into invalid',()=>{const r=routeGuaranteeQuestion('qual o status?',p);expect(r.answer).toContain('REVIEW_REQUIRED');expect(r.answer).toContain('não significa que ela seja inválida');});
  it('answers established change and uncertainty',()=>{expect(routeGuaranteeQuestion('o que mudou?',p).answer).toContain('condição');expect(routeGuaranteeQuestion('o que não sabemos?',p).answer).toContain('não está estabelecido');});
});
