# Deployment

Deployment target: `sa-east-1`, AWS profile `kos-project-foundry-dev`.

```powershell
$env:AWS_PROFILE='kos-project-foundry-dev'
$env:CDK_DEFAULT_REGION='sa-east-1'
$env:AWS_DEFAULT_REGION='sa-east-1'
pnpm.cmd build
Set-Location infra-cdk
pnpm.cmd run deploy
```

After deployment, the stack outputs `WebUrl`, `ApiUrl`, `UserPoolId`, `UserPoolClientId` and `HostedUiUrl`. The Cognito client callback URL must be updated to the returned CloudFront `WebUrl` before hosted-UI login. Keep proof-user credentials outside the repository.

The stack is isolated and has no imports or exports that bind it to existing KOS stacks.

Physical acceptance must verify both the canonical CloudFront URL and the protected API through the same browser session. Record safe metadata only: HTTP status, authenticated/rejected state, Passport status and event count. Never record token values.

Final closure validation covers both restored-session and no-session paths. The browser should load the Passport when a valid Cognito session exists, and after Sign out it should show `AUTH_REQUIRED` and require Cognito again.
