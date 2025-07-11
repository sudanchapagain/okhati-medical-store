# Okhati Medical Store

a standard react app. see `package.json`. set `VITE_API_BASE_URL` to proxy
backend for the react app.

#### issues

- product upload on `render.com` doesn't work.
- transaction call back on vercel doesn't work properly.

#### Docker

To run the application using Docker, you can use the following commands.

##### Build the Image

```sh
docker build -t okhati-medical-store .
```

##### Run the Container

You can run the application using either SQLite or PostgreSQL as the database.

**For SQLite:**

```sh
docker run -p 80:80 \
  -e USE_SQLITE_DB=True \
  -e JWT_SECRET_KEY=your-secret-key \
  okhati-medical-store
```

**For PostgreSQL:**

```sh
docker run -p 80:80 \
  -e USE_SQLITE_DB=False \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_SERVER=your-db-host \
  -e POSTGRES_DB=dbname \
  -e JWT_SECRET_KEY=your-secret-key \
  okhati-medical-store
```

- **Frontend:** [http://localhost](http://localhost)
- **API:** [http://localhost/api](http://localhost/api)
- **API Docs:** [http://localhost/api/docs](http://localhost/api/docs)