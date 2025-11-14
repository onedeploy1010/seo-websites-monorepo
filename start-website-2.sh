#!/bin/bash
cd /www/wwwroot/seo-websites-monorepo
exec dotenv -e /www/wwwroot/seo-websites-monorepo/.env.local -- node /www/wwwroot/seo-websites-monorepo/apps/website-2/node_modules/next/dist/bin/next start -p 3002
