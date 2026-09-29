import {describe,it,expect} from 'vitest';
import {buildLogoutUrl,parseCallbackHash} from './auth.js';
describe('Cognito callback handling',()=>{
  it('extracts the id_token from an implicit-flow callback hash',()=>expect(parseCallbackHash('#id_token=abc123&access_token=redacted&expires_in=3600')).toBe('abc123'));
  it('does not invent a session when the callback has no id_token',()=>expect(parseCallbackHash('')).toBe(''));
  it('builds a Cognito logout redirect without session data',()=>expect(buildLogoutUrl('https://login.example','client-1','https://app.example/')).toBe('https://login.example/logout?client_id=client-1&logout_uri=https%3A%2F%2Fapp.example%2F'));
});
