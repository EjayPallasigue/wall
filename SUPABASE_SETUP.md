# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created

## 2. Create Database Table

1. In your Supabase dashboard, go to **Table Editor**
2. Click **"Create a new table"**
3. Use these settings:
   - **Name**: `posts`
   - **Description**: `Wall posts table`
   - **Enable RLS**: ✅ (checked)

4. Add these columns:

| Column Name | Type | Default Value | Nullable | Primary Key |
|-------------|------|---------------|----------|-------------|
| `id` | `uuid` | `gen_random_uuid()` | ❌ | ✅ |
| `name` | `text` | - | ❌ | ❌ |
| `text` | `text` | - | ❌ | ❌ |
| `image_url` | `text` | - | ✅ | ❌ |
| `created_at` | `timestamptz` | `now()` | ❌ | ❌ |

5. Click **"Save"**

## 3. Enable Realtime

1. Go to **Database** → **Replication**
2. Find the `posts` table
3. Toggle **Realtime** to **ON**

## 4. Create Storage Bucket

1. Go to **Storage**
2. Click **"Create bucket"**
3. Use these settings:
   - **Name**: `wall-uploads`
   - **Public**: ✅ (checked)
   - **File size limit**: `10 MB`
   - **Allowed MIME types**: `image/png,image/jpeg,image/webp`

4. Click **"Create bucket"**

## 5. Set Up Storage Policies

1. In the `wall-uploads` bucket, go to **Policies**
2. Click **"New Policy"**
3. Create these policies:

### Policy 1: Allow public read access
- **Policy name**: `Allow public read access`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**: `true`

### Policy 2: Allow public insert access
- **Policy name**: `Allow public insert access`
- **Allowed operation**: `INSERT`
- **Target roles**: `public`
- **WITH CHECK expression**: `true`

## 6. Set Up Table Policies

1. Go to **Authentication** → **Policies**
2. Find the `posts` table
3. Create these policies:

### Policy 1: Allow public read access
- **Policy name**: `Allow public read access`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**: `true`

### Policy 2: Allow public insert access
- **Policy name**: `Allow public insert access`
- **Allowed operation**: `INSERT`
- **Target roles**: `public`
- **WITH CHECK expression**: `true`

## 7. Get API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## 8. Configure Environment Variables

1. Copy `env.example` to `.env.local`
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

## 9. Test the Setup

1. Run `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Try creating a post with an image
4. Check your Supabase dashboard to see the data

## Troubleshooting

- **"Missing Supabase environment variables"**: Make sure your `.env.local` file exists and has the correct values
- **"Failed to upload photo"**: Check that the storage bucket exists and policies are set correctly
- **Posts not appearing**: Verify that Realtime is enabled and table policies allow public access
