
## Application

1. set env vars

```
USE_SQLITE_DB=True
BASE_URL=https://okhati.vercel.app/
KHALTI_BASE_URL=https://dev.khalti.com/api/v2
KHALTI_SECRET_KEY=
JWT_SECRET_KEY=
```

1. run the application

```sh
uv run main.py
```

## Upload Setup Instructions

1. Create a Supabase Project

2. Get Your Credentials

- Project URL
- anon public key
- service_role secret key

3. update environment vars

```env
SUPABASE_URL=https://xxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGxxxxxxxxxxxxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGcxxxxxxxxxx...
```

4. Create the Storage Bucket

```sh
cd backend && python setup_supabase.py
```
