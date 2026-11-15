# ClickBites – merged build

Your frontend prototype (design, pages, palette, icons) combined with a working version of the SRS logic.

## Run it

Open `index.html` in a browser (or use VS Code Live Server). No build step. Food photos load from Unsplash, so internet is needed for them.

## Demo accounts

| Role                 | Email                           | Password    |
| -------------------- | ------------------------------- | ----------- |
| Administrator        | admin@clickbites.ph             | admin123    |
| Shop owner (7 shops) | owner1@demo.ph … owner7@demo.ph | owner123    |
| Customer             | customer@demo.ph                | customer123 |

Sign-up OTP and the password-reset email are simulated: the code / link appears on screen. Data is stored in the browser's localStorage (stand-in for Supabase). To reset the demo, clear the site data.

## What works

- **Discovery** – hero, categories, featured food, shops, search (shop / food / category), filters (category, price, verified rating, open now / open at a time), chips to clear each filter, sort, load more, saved food (heart), shop page (Overview / Menu / Reviews / About), product page, empty and loading states, external shop link in a new tab.
- **Accounts** – one Sign-Up page for all roles (an email that matches an owner or admin signs in under that role), separate Log-In, SMS OTP (6 digits, 5 min, 5 tries, resend every 60 s, 3 per hour), forgot / reset password (single use, 15 min), profile editing (email or mobile change needs password + OTP), change password with confirmation, Unique Customer ID, role-based redirects, owner/admin sessions expire after 15 min idle.
- **Verified feedback** – owner makes an 8-character code (24 h, single use, can be voided). A customer review checks account, one rating per shop, and the code (right shop, unused, not expired, not voided); 3 wrong codes per hour blocks entry. Success consumes the code and saves a "Verified Purchase" review; the shop average counts verified ratings only. Existing ratings can be edited without a new code.
- **Owner dashboard** – shop profile, products (WebP-compressed photos), receipt codes (generate / void / status), verified feedback.
- **Admin dashboard** – create owner + shop, edit shop location (address), users (edit / suspend / reactivate), categories (category in use cannot be deleted), moderation (remove feedback or listings).

## Decisions

- Location/GPS is not included anywhere (customers are not location-checked); admin only records each shop's address as text.
- The logo is `logo.jpg` (from your 1.jpg) in the header, footer, auth page and dashboards. Your fork-and-spoon icon is still used as the UI icon.
- Ratings start empty: no fake sample ratings, because only verified feedback counts.
- Dropped the static "Reports" page (not in the SRS); "Reviews" is the moderation page.

## For the real backend

Everything marked "server" in the SRS (role, OTP, code validation, atomic code use, rate limits) runs in the browser here, so it is not a security boundary. Move it to Supabase Auth, RLS and a database function before real use.
