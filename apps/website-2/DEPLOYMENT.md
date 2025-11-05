# Website-2 Deployment Guide

## Vercel Environment Variables

This application requires the following environment variables to be set in Vercel:

### Required Variables

```env
DATABASE_URL=postgresql://neondb_owner:npg_gcf5GWB7KUqo@ep-aged-mouse-ah3vtfl7-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_SITE_NAME=电报营销
```

### Optional Variables

```env
NEXT_PUBLIC_API_URL=https://your-admin-api-url.vercel.app
```

## Setup Steps

1. Go to Vercel Dashboard
2. Select the `website-2` project
3. Navigate to Settings → Environment Variables
4. Add each variable above
5. Select all environments (Production, Preview, Development)
6. Redeploy the application

## Notes

- The app uses dynamic rendering (`force-dynamic`) to fetch data at runtime
- Database queries are handled server-side only
- Pages will fail to build without `DATABASE_URL`
