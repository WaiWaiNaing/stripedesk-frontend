# StripeDesk FrontEnd

Vue 3 + Vite + TypeScript SPA for the StripeDesk API: shop checkout, admin products, invoices, receipts (list + PDF download), and JWT + OTP auth with httpOnly cookies.

## Live deployment

| Environment | URL |
|-------------|-----|
| **Production SPA** | [https://stripedesk.duolinkmm.com/](https://stripedesk.duolinkmm.com/) |
| **API + Swagger** | [https://api-stripedesk.duolinkmm.com/docs/#/](https://api-stripedesk.duolinkmm.com/docs/#/) |

Point the SPA at the API by setting `VITE_API_BASE_URL` to the API’s **versioned REST base** (including `/api/v1`), e.g. `https://api-stripedesk.duolinkmm.com/api/v1`. The backend must allow the SPA origin in `CORS_ALLOW_ORIGIN` and use cookie settings compatible with cross-site auth (`SameSite=None`, `Secure` in production).

## Checkout & fulfillment (what the UI does)

After Stripe Checkout redirects back, the success view calls **`POST /checkout/reconcile`** with `session_id` so orders are fulfilled even when the **webhook is slower than the browser**. If the session is not yet complete, the app shows a **pending** state instead of a false success. Together with the API’s idempotent fulfillment and server-side cron reconciliation, this avoids duplicate invoices/receipts and recovers from short outages. See the backend `README.md` section **Payment fulfillment resilience** for the full layer table.

## OTP in API responses (staging / no SMTP)

Some hosts (e.g. DigitalOcean without a transactional email provider) block or restrict outbound SMTP. For those environments the API can enable `OTP_DEV_RETURN_CODE=true` so OTP codes appear **in JSON responses** for registration/password-reset flows—**only for non-production testing**. Plan to switch to a real mail provider and disable that flag in production. Details: backend `README.md` → **OTP verification & SMTP (production note)**.

## Requirements

- Node 18+ (recommended)
- Yarn (Berry / modern Yarn as in this repo’s lockfile)

## Environment

Create `.env` in the project root (Vite reads `VITE_*` at build time):

```env
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

For production builds, set this to your deployed API base URL.

## Scripts

```sh
yarn              # install
yarn dev          # dev server (default Vite port)
yarn build        # production build
yarn type-check   # vue-tsc
yarn lint         # ESLint
```

## Stack

- Vue 3, Vue Router, Pinia  
- TanStack Query (Vue)  
- Ant Design Vue  
- TypeScript, Vite  

## Related repository

Backend (CodeIgniter 3, Stripe webhooks, receipts PDF, cron reconcile): use the **StripeDesk** API repo and its `README.md` for Docker, `.env`, Ngrok webhooks (`/api/v1/stripe/webhook`), and operations.
