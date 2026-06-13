# Tool feedback mail (P4C)

Server-side email flow for calculation result feedback on tool pages.

## Env (server only)

| Variable | Required | Description |
|---|---|---|
| `BREVO_API_KEY` | yes | Brevo transactional API key |
| `BREVO_FROM_EMAIL` | yes | Verified sender address |
| `FEEDBACK_TO_EMAIL` | yes | Inbox for feedback notifications |
| `FEEDBACK_REPLY_TO_EMAIL` | no | Default reply-to when user email is omitted |

Never expose these in client bundles or `NEXT_PUBLIC_*`.

## API

`POST /api/tool-feedback`

### Body

```json
{
  "toolSlug": "string",
  "toolTier": "free | premium | premium-schema | unknown",
  "locale": "tr",
  "pageUrl": "https://sectorcalc.com/tr/tools/...",
  "message": "string",
  "email": "optional",
  "issueType": "optional",
  "resultSnapshot": "optional object|string",
  "userAgent": "optional",
  "honeypot": "optional — bots only"
}
```

### Responses

| Status | Body |
|---|---|
| 200 | `{ "ok": true }` |
| 400 | validation error |
| 502 | `{ "ok": false, "error": "feedback_mail_failed" }` |
| 503 | `{ "ok": false, "error": "feedback_mail_unavailable" }` |

## UI

`CalculationFeedbackModal` posts to this route from tool result panels (`CalculationFeedbackButton`).

## Local curl test

```bash
curl -X POST http://localhost:3000/api/tool-feedback \
  -H "Content-Type: application/json" \
  -d '{"toolSlug":"test-tool","toolTier":"premium-schema","locale":"tr","pageUrl":"http://localhost:3000/tr/tools/premium-schema/test-tool","message":"Test geri bildirimi","email":"test@example.com"}'
```

## Build without env

`npm run build` must succeed when Brevo/feedback env vars are unset. The route returns 503 at runtime only.
