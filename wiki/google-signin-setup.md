# Google sign-in for Room Quest — setup notes

Supabase callback URL (copy from Supabase → Authentication → Sign In / Providers → Google):
  https://pzscvrhqsndxduqojtui.supabase.co/auth/v1/callback

Site: https://tricknolodge.onrender.com   (page: /rq.html)

1. Supabase: open the Google provider and copy the Callback URL (leave the tab open).
2. Google Cloud console (console.cloud.google.com): create a project "Room Quest".
3. Google Auth Platform → set up: app name "Room Quest", your support email, Audience = External, contact email.
4. Audience → publish the app (basic sign-in only needs email + profile, so no review is required).
5. Clients → Create client → Web application.
   - Authorized JavaScript origin: https://tricknolodge.onrender.com
   - Authorized redirect URI: the Supabase callback URL from step 1
6. Copy the Client ID and Client secret (the secret stays private — never paste it in chat or a file in git).
7. Supabase: paste both into the Google provider, enable it, Save.
8. Supabase → Authentication → URL Configuration: Site URL = https://tricknolodge.onrender.com
   and add Redirect URL = https://tricknolodge.onrender.com/rq.html
