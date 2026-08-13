# Supabase Integration & Production Deployment Guide

This guide walks you through setting up your Supabase project, importing the database schema, configuring the environment variables, and deploying your React application online.

---

## 1. Creating the Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in or create a free account.
2. In the dashboard, click **New Project** and select your organization.
3. Configure your project:
   - **Name**: `Legend Barber Shop` (or any name you prefer)
   - **Database Password**: Set a strong password (save this password somewhere secure!)
   - **Region**: Choose a region closest to your main audience.
4. Click **Create new project** and wait a few minutes for the database to provision.

---

## 2. Creating Tables & Applying SQL Schema

To apply our complete database structures, indices, security rules, and seed data:

1. In your Supabase dashboard, click on the **SQL Editor** tab from the left-side navigation (the icon looks like `>_`).
2. Click **New query** (or **New Blank Query**).
3. Copy the entire contents of the local file [supabase_schema.sql](file:///c:/Users/Moatez/OneDrive/Bureau/My-websites/legend-barber-shop/supabase_schema.sql) and paste it into the editor.
4. Click the **Run** button (or press `Ctrl + Enter` / `Cmd + Enter`).
5. Verify that the query executes successfully with a "Success" message. This creates:
   - Tables: `barbers`, `barber_schedules`, `shop_schedules`, `services`, and `reservations`.
   - Security: Enable Row Level Security (RLS) on all tables.
   - Index: The unique index to prevent double bookings.
   - Seed data: Configures shop hours, services, and the 3 barbers with schedules.

---

## 3. Configuring Row Level Security (RLS)

Applying the SQL script in Step 2 automatically configures Row Level Security (RLS) with the following secure public access policies:
* **`barbers` / `barber_schedules` / `shop_schedules` / `services`**: Public users are permitted to read (SELECT) data only. Write actions are locked.
* **`reservations`**: Public users can read (SELECT) reservations (which enables checking if a slot is already booked) and create (INSERT) new reservations.

If you ever need to view or edit these policies manually:
1. Click on the **Database** tab in the Supabase sidebar.
2. Click on **Policies** under the security section.
3. Here you will see each table and its active RLS policies.

---

## 4. Configuring Environment Variables

To connect your React project to Supabase:

1. Click on the **Project Settings** gear icon in the lower corner of the Supabase sidebar.
2. Go to **API**.
3. Under **Project API keys**, copy:
   - **URL**: The API URL (looks like `https://xxxxxx.supabase.co`).
   - **anon public**: The public anonymous key.
4. In the root of your local React project, open the [.env](file:///c:/Users/Moatez/OneDrive/Bureau/My-websites/legend-barber-shop/.env) file (or copy [.env.example](file:///c:/Users/Moatez/OneDrive/Bureau/My-websites/legend-barber-shop/.env.example) to `.env`).
5. Replace the values:
   ```env
   VITE_SUPABASE_URL=your-copied-supabase-url
   VITE_SUPABASE_ANON_KEY=your-copied-anon-public-key
   ```

---

## 5. Connecting React to Supabase

The application uses the official `@supabase/supabase-js` client wrapper.
- **Client Configuration**: Initialized inside [src/supabaseClient.ts](file:///c:/Users/Moatez/OneDrive/Bureau/My-websites/legend-barber-shop/src/supabaseClient.ts).
- **Time Slots & Bookings**: Query results are fetched from the live database on date/barber change, ensuring real-time client-side sync.
- **Safety**: No database passwords or private service-role keys are compiled into the React code.

---

## 6. Testing the Reservation System

Once configured locally, test the database gatekeeper:
1. Run the local dev server using `npm run dev`.
2. Open two different browser tabs (e.g. Chrome and Firefox, or normal and Incognito) and select the same Date, Barber, and Time slot.
3. Fill in the client info on both screens.
4. Click **Book** on Tab A. It will successfully save to your Supabase `reservations` table.
5. Immediately click **Book** on Tab B.
   - The application will catch the database's unique constraint violation (`unique_active_barber_reservation`).
   - Tab B will display the message: *"Entschuldigung, dieser Termin wurde gerade eben von einem anderen Kunden gebucht. Bitte wählen Sie eine andere Zeit."*
6. Check your Supabase database table `reservations` to verify only one record exists.

---

## 7. Deploying the Production Version

When deploying your React website to hosting providers like **Vercel**, **Netlify**, or **GitHub Pages**:

1. Run the local build command to verify everything compiles:
   ```bash
   npm run build
   ```
2. Deploy the generated `dist/` directory or link your GitHub repository to your hosting provider.
3. **CRITICAL STEP**: Add these environment variables in your hosting provider's dashboard settings:
   - Name: `VITE_SUPABASE_URL` | Value: `(your production Supabase URL)`
   - Name: `VITE_SUPABASE_ANON_KEY` | Value: `(your production anon public key)`
4. The deployment environment variables will be injected at build time, and your live website will be securely connected to your online Supabase PostgreSQL database.
