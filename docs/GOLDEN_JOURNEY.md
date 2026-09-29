# Golden Journey

1. Open the CloudFront web URL and choose **Sign in with Cognito**.
2. Authenticate with the product-owned Cognito user.
3. Open `Rural Property Guarantee · GP-001`.
4. Confirm the compact state **Review required** and the explanation that one new condition was observed.
5. Ask: `Essa garantia continua válida para a decisão original?`
6. Read the governed answer. It separates known facts, the observed change, what is not established, and the need for human review.
7. Confirm the timeline shows passport creation and registry/environmental condition change.
8. Confirm the operational panel shows checks, sources, changes and reviews required.
9. Confirm the final state is **Review required**; no autonomous approval is offered.

Product events persisted by the API include `CHECK_REQUESTED` and support `HUMAN_REVIEW_RECORDED`. `GUARANTEE_CREATED`, `SOURCE_ASSOCIATED`, `CHANGE_OBSERVED` and `REVIEW_REQUIRED` are part of the product event vocabulary and may be added by the next product workflow extension.
