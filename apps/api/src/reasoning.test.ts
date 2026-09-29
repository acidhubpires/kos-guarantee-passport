import {describe,it,expect} from 'vitest';
import {fixture} from './domain.js';
import {classifyGuaranteeQuestion,explainGuarantee} from './reasoning.js';

const p=fixture('tenant-test');

describe('bounded Guarantee Passport reasoning',()=>{
  it.each([
    ['qual o status','STATUS'],
    ['me explique o contexto da garantia','CONTEXT'],
    ['o que mudou?','RECENT_CHANGE'],
    ['essa mudança é material?','MATERIALITY'],
    ['quais são as fontes?','SOURCES'],
    ['quando foi verificada?','FRESHNESS'],
    ['quem precisa decidir?','REVIEW'],
    ['o que não sabemos?','MISSING'],
    ['me mostre o histórico','TIMELINE'],
    ['quantos checks existem?','CHECKS'],
    ['o que é este chat?','CONVERSATION'],
    ['qual será a cotação do dólar amanhã?','OUT_OF_SCOPE']
  ])('%s -> %s',(question,capability)=>{
    expect(classifyGuaranteeQuestion(question)).toBe(capability);
  });

  it('explains actual review-required state without inventing validity',()=>{
    const result=explainGuarantee('qual o status',p);
    expect(result.answer).toContain('REVIEW_REQUIRED');
    expect(result.answer).toContain('revisão humana');
    expect(result.answer).toContain('não significa');
  });

  it('keeps materiality unresolved',()=>{
    const result=explainGuarantee('essa mudança é material?',p);
    expect(result.answer).toContain('não está estabelecido');
    expect(result.answer).toContain('revisão humana');
  });

  it('states integration truth for sources',()=>{
    const result=explainGuarantee('quais são as fontes?',p);
    expect(result.answer).toContain('Evidence: unavailable');
    expect(result.answer).toContain('não deve ser apresentado como leitura live');
  });
});
