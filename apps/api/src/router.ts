import type {Passport} from './domain.js';

export type GuaranteeCapability =
  | 'GUARANTEE_CONTEXT_SYNTHESIS'
  | 'CURRENT_STATUS'
  | 'ORIGINAL_DECISION_CONTEXT'
  | 'RECENT_CHANGE'
  | 'MATERIALITY'
  | 'SUPPORTING_SOURCES'
  | 'FRESHNESS'
  | 'REVIEW_REQUIREMENT'
  | 'TIMELINE'
  | 'MISSING_KNOWLEDGE'
  | 'CHECKS'
  | 'CONVERSATION_CONTEXT'
  | 'OUT_OF_SCOPE';

export type RoutedAnswer = {capability:GuaranteeCapability; answer:string};

const normalize=(value:string)=>value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const has=(q:string,patterns:RegExp[])=>patterns.some(pattern=>pattern.test(q));
const date=(iso:string)=>new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeZone:'UTC'}).format(new Date(iso));

export function routeGuaranteeQuestion(question:string,p:Passport):RoutedAnswer{
  const q=normalize(question);
  let capability:GuaranteeCapability;
  if(has(q,[/dolar/,/cotacao/,/preco/,/tempo hoje/,/noticia/,/fora do/])) capability='OUT_OF_SCOPE';
  else if(has(q,[/o que e este chat/,/o que posso perguntar/,/contexto desta conversa/,/como funciona este chat/])) capability='CONVERSATION_CONTEXT';
  else if(has(q,[/o que nao sabemos/,/o que esta faltando/,/lacuna/,/nao foi estabelecido/,/missing/,/unknown/])) capability='MISSING_KNOWLEDGE';
  else if(has(q,[/quem precisa decidir/,/proximo passo/,/o que precisa ser revisado/,/por que precisa de revisao/,/pendencia/,/review/])) capability='REVIEW_REQUIREMENT';
  else if(has(q,[/historico/,/sequencia/,/desde a criacao/,/timeline/,/linha do tempo/])) capability='TIMELINE';
  else if(has(q,[/fonte/,/evidencia/,/sustenta/,/de onde veio/,/source/])) capability='SUPPORTING_SOURCES';
  else if(has(q,[/atualizad/,/frescura/,/ultima checagem/,/ultima verific/,/quando foi checad/,/quando foi verific/,/fresh/])) capability='FRESHNESS';
  else if(has(q,[/material/,/impacto/,/compromete/,/afeta a garantia/,/afeta a decisao/])) capability='MATERIALITY';
  else if(has(q,[/o que mudou/,/alteracao/,/aconteceu recent/,/por que entrou em revisao/,/mudanca/,/change/])) capability='RECENT_CHANGE';
  else if(has(q,[/decisao original/,/para que/,/o que ela garantia/,/decision context/,/decision/])) capability='ORIGINAL_DECISION_CONTEXT';
  else if(has(q,[/quantas verific/,/quantos checks/,/checks/,/verificacoes foram/,/check/])) capability='CHECKS';
  else if(has(q,[/status/,/como esta/,/esta valida/,/posso confiar/,/continua estavel/,/situacao atual/,/valid/])) capability='CURRENT_STATUS';
  else if(has(q,[/explique/,/contexto/,/visao geral/,/resuma/,/o que esta acontecendo/,/passport/,/garantia/])) capability='GUARANTEE_CONTEXT_SYNTHESIS';
  else capability='GUARANTEE_CONTEXT_SYNTHESIS';

  const unresolved='O impacto material sobre a decisão original ainda não foi estabelecido.';
  const answerByCapability:Record<Exclude<GuaranteeCapability,'OUT_OF_SCOPE'>,string>={
    GUARANTEE_CONTEXT_SYNTHESIS:`Esta é a garantia ${p.guaranteeRef} para ${p.assetName}. Ela apoia ${p.decisionBasis}. O estado atual é ${p.statusLabel.toUpperCase()}: uma nova condição ambiental ou registral foi observada em ${date(p.observations[p.observations.length-1]?.at??p.lastCheckedAt)}. ${unresolved} Há ${p.sources} fontes no registro do produto, ${p.checks} verificações e ${p.reviewsRequired} revisão pendente.`,
    CURRENT_STATUS:`Status: ${p.status}. A garantia não deve ser tratada como estável neste momento. Uma nova condição foi observada, mas isso não significa que ela seja inválida ou rejeitada. ${unresolved} Por isso, requer revisão humana antes de continuar sendo usada como base da decisão.`,
    ORIGINAL_DECISION_CONTEXT:`A decisão original foi uma aprovação de crédito respaldada por uma garantia sobre propriedade rural (${p.decisionBasis}).`,
    RECENT_CHANGE:`O que mudou: foi observada uma nova condição ambiental ou registral em ${date(p.observations[p.observations.length-1]?.at??p.lastCheckedAt)}. A alteração levou o Passport a REVIEW_REQUIRED. ${unresolved}`,
    MATERIALITY:`A mudança pode afetar a base da garantia, mas sua materialidade ainda não foi estabelecida. Este Passport registra a observação e exige revisão humana; não determina sozinho o impacto nem invalida a garantia.`,
    SUPPORTING_SOURCES:`O registro atual informa ${p.sources} fontes associadas ao produto. Elas são fontes do registro local do Guarantee Passport; a integração pública de Evidence está indisponível neste ambiente, então não há provenance live de Evidence a afirmar.`,
    FRESHNESS:`A última verificação registrada ocorreu em ${date(p.lastCheckedAt)}. O registro local apresenta ${p.sources} fontes e a informação está disponível para consulta, mas sua atualização material ainda requer revisão humana.`,
    REVIEW_REQUIREMENT:`É necessária revisão humana porque uma condição ambiental ou registral mudou e ${unresolved.toLocaleLowerCase()}. Quem precisa decidir: Credit / risk reviewer. O próximo passo é avaliar essa condição antes de manter a garantia como base da decisão.`,
    TIMELINE:`Histórico: ${p.observations.map(o=>`${date(o.at)} — ${o.title}: ${o.detail}`).join(' | ')}.`,
    MISSING_KNOWLEDGE:`Ainda não está estabelecido se a nova condição tem impacto material sobre a decisão original. Também não há, neste produto, uma conclusão de validade jurídica ou uma decisão de aprovação/rejeição.`,
    CHECKS:`O Passport registra ${p.checks} verificações. A última ocorreu em ${date(p.lastCheckedAt)}.`,
    CONVERSATION_CONTEXT:`Este chat é a interface conversacional do Guarantee Passport. Você pode perguntar sobre o estado estabelecido da garantia, mudanças, contexto da decisão, fontes do registro, atualização, histórico, incertezas e requisitos de revisão.`
  };
  if(capability==='OUT_OF_SCOPE') return {capability,answer:'Essa informação está fora do contexto estabelecido deste Guarantee Passport. Posso explicar a garantia, seu status, mudanças, fontes do registro, histórico e o que ainda requer revisão.'};
  return {capability,answer:answerByCapability[capability]};
}
