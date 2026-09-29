import {describe,it,expect} from 'vitest';
import {parseCallbackHash} from './auth.js';
describe('Cognito callback handling',()=>{
  it('extracts the id_token from an implicit-flow callback hash',()=>expect(parseCallbackHash('#id_token=abc123&access_token=redacted&expires_in=3600')).toBe('abc123'));
  it('does not invent a session when the callback has no id_token',()=>expect(parseCallbackHash('')).toBe(''));
});
