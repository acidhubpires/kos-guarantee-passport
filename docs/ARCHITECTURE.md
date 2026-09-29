# Architecture

The product-owned path is:

`CloudFront → S3 SPA` and `CloudFront /api → API Gateway HTTP API → Lambda → product DynamoDB`, with `Cognito User Pool → API Gateway JWT authorizer`.

The stack is `GuaranteePassport-dev` in `sa-east-1`. It owns one DynamoDB table, one User Pool/client/hosted UI, one Lambda, one HTTP API, one private S3 bucket and one CloudFront distribution. The Lambda derives tenant context from the verified JWT claims and never accepts a tenant identifier from the browser.

The SPA uses progressive disclosure: status first, then explanation, timeline, source freshness and review responsibility. Product events are operational history only and do not recreate Evidence Chronicle semantics.

## Authentication closure

The original callback path treated every failed passport load as `p === null`, which rendered the same generic sign-in message whether the browser had no token, the JWT authorizer returned `401`, or the API returned another failure. That hid the first failing boundary during physical acceptance. The closure uses one callback token snapshot, persists it in the product browser session, sends it explicitly as `Authorization: Bearer <id_token>`, and exposes distinct signed-out, authorizer-rejected, API-error and authenticated states. A successful protected response is the only path that renders the Passport.

The product remains on Cognito implicit flow for this sprint because the deployed client is public and the existing hosted UI contract is already provisioned. The browser never accepts tenant authority from the URL or request body; tenant context remains derived from verified JWT claims in Lambda.

Physical deployment diagnosis also found a CloudFront boundary defect: the `/api/*` behavior forwarded the viewer `Host` header to API Gateway, and the distribution's global error response converted the resulting origin error into SPA HTML. The behavior now uses the managed `AllViewerExceptHostHeader` origin request policy and leaves API errors as API responses.

Chat is a bounded deterministic capability router over the Passport contract. It classifies natural-language Portuguese and English requests into status, context, decision context, recent change, materiality, sources, freshness, review, timeline, missing knowledge, checks, conversation context, or safe out-of-scope refusal. It does not call an LLM or make an approval, rejection, legal-validity, or materiality decision.

Sign out removes the product browser token before redirecting through the product Cognito hosted-UI logout endpoint. Cognito returns to the product root, which then presents `AUTH_REQUIRED` because no product session remains.

## Status projection

`STABLE` means no material change observed in the product record. `ATTENTION_REQUIRED` means a change needs attention but human review is not yet required. `REVIEW_REQUIRED` means a materiality decision remains open. The fixture is intentionally `REVIEW_REQUIRED` after the new observation.
