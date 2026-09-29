export function parseCallbackHash(hash:string){return new URLSearchParams(hash.replace(/^#/,'')).get('id_token')??''}
