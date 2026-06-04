# Local scripts

Utilities for one-off admin tasks. **Not** imported by the Next.js app or Firebase Hosting bundle.

## Set admin custom claim

Grants `{ admin: true }` to **exactly one** Firebase Auth user.

### Prerequisites

1. Firebase Console → Project settings → Service accounts → **Generate new private key**
2. Save the JSON file **outside** the repo (or in a gitignored path)
3. Create the Auth user in Firebase Console (Authentication → Users) if needed
4. Copy the user **UID** from the Firebase Console user record

### Google sign-in admin claim

After a user signs in with Google for the first time:

1. Firebase Console → Authentication → Users → copy the new user **UID**
2. Grant admin claim (local script only):

```bash
FIREBASE_SERVICE_ACCOUNT_JSON="$(cat /path/to/service-account.json)" \
  node scripts/set-admin-claim.mjs GOOGLE_AUTH_UID
```

3. User signs out and signs in again at `/login` (Google or email/password)

Admin access is determined by `{ admin: true }` custom claim on the UID — not by email address.

### Run

```bash
FIREBASE_SERVICE_ACCOUNT_JSON="$(cat /path/to/service-account.json)" \
  node scripts/set-admin-claim.mjs FIREBASE_AUTH_UID
```

Example:

```bash
FIREBASE_SERVICE_ACCOUNT_JSON="$(cat ~/Downloads/sectorcalc-bf412-firebase-adminsdk-fbsvc-7b3877fbb8.json)" \
  node scripts/set-admin-claim.mjs AbCdEf1234567890AbCdEf12
```

Optional npm alias (same args):

```bash
FIREBASE_SERVICE_ACCOUNT_JSON="$(cat /path/to/service-account.json)" \
  npm run admin:set-claim -- FIREBASE_AUTH_UID
```

### Safety

- Requires a single UID argument — no bulk / wildcard mode
- Rejects invalid or blocked UID values
- Loads credentials only from `FIREBASE_SERVICE_ACCOUNT_JSON` (never from `NEXT_PUBLIC_*`)
- Prints target email before writing
- Skips if `{ admin: true }` is already set

### After running

The user must refresh their ID token:

- Sign out and sign in again at `/login`, **or**
- In app code: `await currentUser.getIdToken(true)`

Until the token is refreshed, `/admin/leads` Kaydet will treat the user as non-admin.

### Verify

1. Sign in at https://sectorcalc-bf412.web.app/login
2. Open `/admin/leads` — admin bar should show the email
3. With `NEXT_PUBLIC_ENABLE_ADMIN_LEAD_WRITE=true`, Kaydet should be enabled for Firestore leads
