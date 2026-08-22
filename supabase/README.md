# Supabase setup

1. Create a Supabase project.
2. Run `schema.sql`, then `seed.sql`, in the SQL Editor.
3. Copy `.env.example` to `.env.local` and add the project URL and anon key.
4. In Authentication > URL Configuration, add the local and deployed app URLs.

The app uses local browser persistence when these variables are absent, so it remains demoable without external setup.
