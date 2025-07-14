# Okhati Medical Store

a standard react app. see `package.json`.

## run on your system

1. download required dependencies: `sqlite or postgres`, `nodejs`, `python`,
   `uv`.

2. set environment variables.
   - for frontend set `VITE_API_BASE_URL`.
   - for backend set everything listed in `backend/.env.production.template`

3. run frontend via either `npm run dev` or `npm run build` with a server to
   serve the built pages. run backend via simple `uv run main.py`.

## run via container

```sh
# build the image or download the one made by github ci from github
docker build -t okhati-medical-store .
# run the image with port mapping
docker run -p 80:80 okhati-medical-store
```

- frontend: [http://localhost](http://localhost)
- api: [http://localhost/api](http://localhost/api)
- api docs: [http://localhost/api/docs](http://localhost/api/docs)
