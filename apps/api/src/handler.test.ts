import {describe,it,expect} from 'vitest'; import {fixture} from './domain.js';
describe('Guarantee Passport domain',()=>{it('starts the golden fixture in review-required state',()=>{expect(fixture('tenant-a').status).toBe('REVIEW_REQUIRED')}); it('keeps tenants in the key space',()=>{expect(fixture('a').tenantId).not.toBe(fixture('b').tenantId)});});
