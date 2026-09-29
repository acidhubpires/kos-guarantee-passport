import type {Passport} from './domain.js';

export type GuaranteeCapability =
  | 'CONTEXT'
  | 'STATUS'
  | 'ORIGINAL_DECISION'
  | 'RECENT_CHANGE'
  | 'MATERIALITY'
  | 'SOURCES'
  | 'FRESHNESS'
  | 'REVIEW'
  | 'TIMELINE'
  | 'MISSING'
  | 'CHECKS'
  | 'CONVERSATION'
  | 'OUT_OF_SCOPE';

const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const has=(q:string,...terms:string[])=>terms.some(term=>q.includes(term));

export function classifyGuaranteeQuestion(question:string):GuaranteeCapability{
  const q=normalize(question);
  if(has(q,'dolar','exchange rate','weather','tempo amanha','cotacao')) return 'OUT_OF_SCOPE';
  if(has(q,'este chat','esse chat','deste chat','desse chat','esta conversa','essa conversa','o que posso perguntar','what can i ask')) return 'CONVERSATION';
  if(has(q,'fonte','fontes','evidencia','evidencias','sustenta','proveniencia','source','evidence')) return 'SOURCES';
  if(has(q,'historico','timeline','sequencia dos eventos','desde a criacao','history')) return 'TIMELINE';
  if(has(q,'quando foi verificada','quando foi verificado','ultima checagem','ultima verificacao','atualizada','atualizado','freshness','last checked')) return 'FRESHNESS';
  if(has(q,'quantas verificacoes','quantos checks','quantas checagens','checks existem','how many checks')) return 'CHECKS';
  if(has(q,'quem precisa decidir','quem decide','proximo passo','precisa de revisao','precisa revisar','pendencia','reviewer','who needs to decide')) return 'REVIEW';
  if(has(q,'o que nao sabemos','nao sabemos','esta faltando','está faltando','lacuna','lacunas','nao estabelecido','missing','unknown')) return 'MISSING';
  if(has(q,'material','impacto','afeta a garantia','compromete a decisao','compromete a decisão')) return 'MATERIALITY';
  if(has(q,'o que mudou','mudou recentemente','houve alguma alteracao','houve alguma alteração','o que aconteceu','por que entrou em revisao','change','changed')) return 'RECENT_CHANGE';
  if(has(q,'decisao original','decisão original','para que essa garantia','para que esta garantia','o que ela garantia','original decision')) return 'ORIGINAL_DECISION';
  if(has(q,'qual o status','qual é o status','qual e o status','como esta a garantia','como está a garantia','situacao atual','situação atual','continua valida','continua válida','continua estavel','continua estável','posso confiar','status')) return 'STATUS';
  if(has(q,'contexto da garantia','contexto do passport','explique essa garantia','explique esta garantia','visao geral','visão geral','resuma a situacao','resuma a situação','explique esse passport','explique este passport','o que esta acontecendo','o que está acontecendo','overview')) return 'CONTEXT';
  return 'OUT_OF_SCOPE';
}

const date=(iso:string)=>new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC'}).format(new Date(iso));
const latestChange=(p:Passport)=>[...p.observations].reverse().find(o=>o.severity==='review'||o.severity==='attention') ?? p.observations.at(-1);

export function explainGuarantee(question:string,p:Passport):{capability:GuaranteeCapability;answer:string}{
  const capability=classifyGuaranteeQuestion(question);
  const change=latestChange(p);
  const changeText=change? `${change.title} (${date(change.at)}): ${change.detail}` : 'Nenhuma mudança está estabelecida no registro atual.';
  const integrationTruth=`As fontes pertencem ao registro local do produto. Integração Evidence: ${p.integration.evidence}; Foundry: ${p.integration.foundry}. Isso não deve ser apresentado como leitura live governada quando a integração está indisponível.`;

  const answers:Record<GuaranteeCapability,string>={
    CONTEXT:`A ${p.assetName} (${p.guaranteeRef}) suporta originalmente o contexto “${p.decisionBasis}”. O estado atual é ${p.status}. Há ${p.changes} mudança(s) registrada(s), ${p.reviewsRequired} revisão(ões) requerida(s) e ${p.sources} fonte(s) no registro do produto. A mudança mais recente é: ${changeText} O impacto material ainda não foi estabelecido; a decisão permanece humana.`,
    STATUS:`Status: ${p.status}. ${changeText} O impacto material sobre a decisão original ainda não foi estabelecido; por isso a garantia requer revisão humana antes de continuar sendo usada como base da decisão. REVIEW_REQUIRED não significa, por si só, válida, inválida ou rejeitada.`,
    ORIGINAL_DECISION:`Contexto da decisão original: “${p.decisionBasis}”. O Passport registra que a garantia foi criada como estável para essa decisão em ${date(p.createdAt)}. O estado atual não autoriza concluir automaticamente que a decisão original continua suportada.`,
    RECENT_CHANGE:`Mudança observada: ${changeText} O registro atual contabiliza ${p.changes} mudança(s). Observação de mudança não equivale a impacto material estabelecido.`,
    MATERIALITY:`O impacto material não está estabelecido no Passport atual. Existe uma mudança observada que pode afetar a base da garantia, mas o produto não promove essa observação a uma conclusão de materialidade. A revisão humana continua necessária.`,
    SOURCES:`O registro atual contabiliza ${p.sources} fonte(s). ${integrationTruth}`,
    FRESHNESS:`Última checagem registrada: ${date(p.lastCheckedAt)}. O Passport possui ${p.checks} checagem(ns) no estado atual e ${p.sources} fonte(s). Essa data descreve o registro do produto; não prova, sozinha, atualidade de uma integração Evidence externa.`,
    REVIEW:`A garantia requer revisão porque houve uma nova condição ambiental ou registral e seu impacto material sobre a decisão original ainda não foi estabelecido. Quem precisa decidir é o revisor humano de crédito/risco. O produto não aprova nem rejeita autonomamente a garantia.`,
    TIMELINE:`Histórico do Passport:\n${p.observations.map(o=>`- ${date(o.at)} — ${o.title}: ${o.detail}`).join('\n')}`,
    MISSING:`O que ainda não está estabelecido é o impacto material da condição ambiental ou registral observada sobre a decisão original. O Passport não transforma essa ausência de conclusão em “sem impacto”, nem em invalidade da garantia.`,
    CHECKS:`O Passport registra ${p.checks} checagem(ns). A última checagem registrada ocorreu em ${date(p.lastCheckedAt)}.`,
    CONVERSATION:'Este chat é a interface conversacional do Guarantee Passport. Ele explica, dentro do contexto estabelecido do produto, o estado da garantia, a decisão original, mudanças, fontes, atualidade, lacunas e necessidade de revisão. As respostas são explicações candidatas: não aprovam, rejeitam ou substituem a autoridade humana.',
    OUT_OF_SCOPE:'Essa pergunta está fora do contexto estabelecido deste Guarantee Passport. Posso explicar o estado da garantia, a decisão original, o que mudou, as fontes disponíveis, o que ainda não está estabelecido e quem precisa revisar.'
  };
  return {capability,answer:answers[capability]};
}
