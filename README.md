# KNOOVI Full-Stack Store Starter

This package keeps the original KNOOVI storefront design and adds an easy Admin panel.

## Included
- `index.html` — KNOOVI storefront based on the uploaded HTML.
- `admin/index.html` — product/order/banner/coupon/settings dashboard.
- `supabase-schema.sql` — production database schema for Supabase.
- Admin changes currently sync through browser `localStorage` so the project works immediately as a demo.

## Important production note
The included Admin panel is a working front-end management demo, not a secure production backend by itself. For a real public store, connect the same screens to Supabase Auth + Postgres + Storage and protect admin operations with Row Level Security. Payment secrets must stay server-side.

## Quick test
1. Put the folder on any static host or run a local server.
2. Open `index.html`.
3. Open `/admin/index.html`.
4. Add/edit a product or offer.
5. Return to the storefront on the same browser/origin to see the managed data.

## Production architecture
Vercel = hosting
Supabase = Auth + Postgres + Storage
Payment gateway = server-side payment order creation + signature/webhook verification
Custom domain = knoovi.in

## Next production wiring
- Replace localStorage product reads with Supabase queries.
- Add Supabase email/Google authentication.
- Add admin role and RLS policies.
- Upload product images to Supabase Storage.
- Save checkout orders to `orders`.
- Connect Razorpay/Cashfree/etc. through a server/Edge Function.
- Add email/WhatsApp notifications.
