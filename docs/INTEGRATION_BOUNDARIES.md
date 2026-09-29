# Integration boundaries

The AWS inventory dated 2026-09-29 is the observed baseline, not deployment authority. Existing Evidence, Foundry and Studio infrastructure remains outside this product stack.

## Actual integration

- **Evidence:** a read-only adapter boundary is implemented for the documented HTTP API base URL. No external Evidence request is made by the fixture path because no product-specific project/token contract was available for this deployment. The UI reports the integration as unavailable rather than fabricating live state.
- **Foundry:** the same read-only adapter boundary targets the documented Foundry HTTP API. It remains unavailable without a concrete authorized project contract.
- **Studio:** the product reuses the reviewed cognition/presentation pattern only. Studio is not called and is not mutated.
- **Fallback:** the deterministic GP-001 fixture is product-owned and explicitly marked as local/product record state.

## Reused pattern versus authority

The product reuses the KOS pattern of Cognito, HTTP API, Lambda, DynamoDB and CloudFront/S3. It does not reuse existing physical tables, Lambda ARNs, buckets, queues, Cognito users, or internal persistence. No Evidence, Foundry or Studio write path exists.
