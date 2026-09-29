# Architecture

The product-owned path is:

`CloudFront → S3 SPA` and `CloudFront /api → API Gateway HTTP API → Lambda → product DynamoDB`, with `Cognito User Pool → API Gateway JWT authorizer`.

The stack is `GuaranteePassport-dev` in `sa-east-1`. It owns one DynamoDB table, one User Pool/client/hosted UI, one Lambda, one HTTP API, one private S3 bucket and one CloudFront distribution. The Lambda derives tenant context from the verified JWT claims and never accepts a tenant identifier from the browser.

The SPA uses progressive disclosure: status first, then explanation, timeline, source freshness and review responsibility. Product events are operational history only and do not recreate Evidence Chronicle semantics.

## Status projection

`STABLE` means no material change observed in the product record. `ATTENTION_REQUIRED` means a change needs attention but human review is not yet required. `REVIEW_REQUIRED` means a materiality decision remains open. The fixture is intentionally `REVIEW_REQUIRED` after the new observation.
