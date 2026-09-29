export function parseCallbackHash(hash:string){return new URLSearchParams(hash.replace(/^#/,'')).get('id_token')??''}
export function clearProductSession(){try{window.localStorage.removeItem('id_token')}catch{}}
export function buildLogoutUrl(hostedUiUrl:string,clientId:string,redirectUri:string){return `${hostedUiUrl}/logout?client_id=${encodeURIComponent(clientId)}&logout_uri=${encodeURIComponent(redirectUri)}`}
