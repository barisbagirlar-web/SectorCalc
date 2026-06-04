# SectorCalc Admin Panel Stable Checkpoint

Date: 2026-06-05  
Project: SectorCalc  
Hosting: https://sectorcalc-bf412.web.app  
GitHub: https://github.com/barisbagirlar-web/SectorCalc.git  
Firebase Project: sectorcalc-bf412

## Current Stable State

SectorCalc admin panel is now beyond MVP validation. It includes authenticated admin login, secure lead updates, audit logging, lead scoring, SLA tracking, source analysis and test lead cleanup.

The project must now shift from technical admin enhancements to revenue-critical product and sales flow decisions.

## Completed Core Infrastructure

### Firebase Hosting
- Static hosting remains active.
- No `src/app/api` route is used.
- Build output remains static / SSG.
- Hosting deploys successfully.

### Firebase Auth Admin Login
- Admin login works through Firebase Auth.
- Admin user requires custom claim:
  - `admin: true`
- Frontend uses Firebase Auth ID token.
- Cloud Functions verify the token before write operations.
- Secret is not exposed to frontend.

### Cloud Functions

#### updateLeadPipeline
Purpose:
- Securely update lead pipeline status and admin note.

Auth:
- Authorization: Bearer Firebase ID token
- Requires `admin === true`

Firestore path:
- `leadIntents/{leadId}`

Writes:
- `status`
- `adminNote`
- `updatedAt`

Preserves:
- `createdAt`

Activity:
- Writes `pipeline_update` records under:
  - `leadIntents/{leadId}/activity/{activityId}`

#### updateLeadTestClassification
Purpose:
- Manually mark or unmark test leads.

Endpoint:
- `https://us-central1-sectorcalc-bf412.cloudfunctions.net/updateLeadTestClassification`

Auth:
- Authorization: Bearer Firebase ID token
- Requires `admin === true`

Firestore writes:
- `isTestLead`
- `testLeadReason`
- `testLeadMarkedAt`
- `testLeadMarkedByUid`
- `testLeadMarkedByEmail`
- `updatedAt`

Activity types:
- `test_lead_marked`
- `test_lead_unmarked`

## Completed Admin Features

### Lead Dashboard
Shows:
- Total leads
- New leads
- Hot / warm / cold
- Qualified
- Converted
- Lost

### Pipeline Management
Statuses:
- `new`
- `reviewed`
- `contacted`
- `qualified`
- `converted`
- `lost`

### Activity Log
Each meaningful lead update records:
- Actor UID
- Actor email
- Previous status
- Next status
- Previous admin note
- Next admin note
- Changed fields
- Created timestamp

### CSV Export
Exports visible leads with extended columns:
- Contact fields
- Status
- Priority
- Attribution
- Quality score
- SLA
- Test lead fields
- Manual test lead fields

### Lead Detail Drawer
Includes:
- Lead summary
- Contact details
- Attribution
- SLA
- Quality score
- Action center
- Activity history
- Data quality / test lead controls

### Conversion Metrics
Calculates:
- Contact rate
- Qualification rate
- Conversion rate
- Loss rate
- Follow-up needed
- Open pipeline
- Last 7 days summary

### Follow-up SLA
Calculates:
- Lead age from `updatedAt ?? createdAt`
- SLA label
- SLA level
- Recommended follow-up action

### Lead Quality Score
Client-side only.
No Firestore write.

Signals:
- Plan
- Source / attribution
- Company
- Email domain
- Intended use
- Message quality
- Industry
- SLA

### Lead Action Center
Generates:
- Recommended action
- Reason
- Suggested status
- Checklist
- WhatsApp copy
- Email copy
- Internal note copy

No automatic message sending.

### Lead Source ROI
Client-side source efficiency scoring.

Not financial ROI.

Based on:
- Quality score
- Qualification rate
- Conversion rate
- Contact rate
- Lost rate
- Urgent follow-up ratio

### Lead Cleanup v1
Client-side automatic test lead detection.

Detects:
- test emails
- deneme / demo / dfdf / asdf
- weak messages
- fake inputs
- URL-like company fields

### Lead Cleanup v2
Manual test lead classification.

Admin can:
- Mark lead as test lead
- Remove test lead mark
- Add reason
- Generate activity log

No delete.
No archive.
No client Firestore write.

## Latest Git Commits

- `23732dc` — Add manual test lead classification
- `38280c1` — Add lead cleanup filters for test data
- `88fa16a` — Add lead source ROI dashboard
- `88e3134` — Add lead action center recommendations
- `ce06eed` — Add lead quality scoring indicators
- `f552b9e` — Add lead follow-up SLA indicators
- `16dc24d` — Track shared application libraries
- `6e39725` — Add lead conversion metrics dashboard
- `b3fd7ff` — Add lead activity log for admin pipeline updates
- `502fbee` — Enable authenticated admin lead pipeline writes

## Current Strategic Decision

Stop adding unnecessary admin micro-features.

Next work must focus on:
1. Paid report product definition
2. Pricing
3. Lead-to-payment flow
4. Report delivery flow
5. Real customer conversion
6. Sales workflow

Primary question for next session:

“What is the first paid SectorCalc report product, who buys it, and what price should it be sold for?”

## Do Not Break

- Do not reintroduce `src/app/api` routes.
- Do not expose secrets to frontend.
- Do not use client Firestore writes for admin actions.
- Do not remove Firebase Auth admin claim enforcement.
- Do not delete leads.
- Do not hardcode service account credentials.
- Do not add automation before sales flow is clear.

## Next Recommended Phase

Revenue Flow v1:
- Define first paid report
- Define price
- Define checkout/payment path
- Define report request form
- Define admin fulfillment workflow
- Define customer delivery message
