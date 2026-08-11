# WebPage Frontend

Vue 3 + TypeScript + Vite frontend for two public personal sites served from a
single build.

## Quick Map

```text
Repository root:  this directory
Remote host:      ubuntu@101.43.122.246

YUANFU static root: /srv/www/web1/dist
LZG static root:    /srv/www/zongguili

YUANFU Nginx site:  /etc/nginx/sites-available/maxia
LZG Nginx site:     /etc/nginx/sites-available/zongguili
```

This is an independent Git repository. Its sibling `../api` repository owns
the Go API and must be deployed separately when API data or routes change.

## Public Entrypoints

| Entry file | Public URL | Purpose |
| --- | --- | --- |
| `index.html` | `https://www.yuanfu.cloud/` | YUANFU portfolio |
| `lobster.html` | `https://www.yuanfu.cloud/lobster.html` | Max page |
| `lzg.html` | `https://www.zongguili.com/` | LZG personal site |
| `lzg.html` | `https://www.yuanfu.cloud/lzg` | Temporary LZG preview |

The Vite multi-entry configuration is in `vite.config.ts`. A build creates
every entry, so a full frontend release can update both static roots.

## Key Files

```text
src/App.vue                         YUANFU portfolio page
src/views/Lobster.vue               Max page
src/views/Lzg.vue                   LZG page
src/lzg.css                         LZG visual system
src/components/LiquidMetalBackground.vue
                                    Shared WebGL background
src/api.ts                          YUANFU API client
src/lzg-api.ts                      LZG API client
index.html / lobster.html / lzg.html
                                    Browser metadata and Vite entries
```

All frontend API clients use relative `/api` URLs in production. Nginx proxies
them to the shared Go API on port `8080`.

## Local Development

```bash
cd "$(git rev-parse --show-toplevel)"
npm install
npm run dev
```

Local pages:

```text
http://localhost:5173/
http://localhost:5173/lobster.html
http://localhost:5173/lzg.html
```

To start API and Vite together:

```bash
cd ..
./start-local.sh
```

## Build And Verify

```bash
cd "$(git rev-parse --show-toplevel)"
npm run build
```

Release verification scripts:

```bash
cd "$(git rev-parse --show-toplevel)/docs"
./build.sh -r
./verify.sh
```

`verify.sh` checks that production bundles use relative `/api` calls rather
than `localhost:8080`.

## Deploy Static Sites

For a full frontend release, build once and synchronize the same `dist/` output
to both roots. Upload to `/tmp` first, then use `sudo` remotely because static
files may not be owned by the `ubuntu` user.

```bash
cd "$(git rev-parse --show-toplevel)"

npm run build

rsync -az --delete dist/ \
  ubuntu@101.43.122.246:/tmp/web1-release-dist/

ssh ubuntu@101.43.122.246 '
  set -e
  sudo rsync -a --delete /tmp/web1-release-dist/ /srv/www/web1/dist/
  sudo rsync -a --delete /tmp/web1-release-dist/ /srv/www/zongguili/
  rm -rf /tmp/web1-release-dist
  sudo nginx -t
'
```

`--delete` is intentional here: `dist/` is the complete static release. Do not
run it with a partial directory. For an isolated hotfix, upload only the exact
generated `index.html` and hashed assets that it references.

## Verify A Release

```bash
curl -fsSI https://www.yuanfu.cloud/
curl -fsS https://www.yuanfu.cloud/api/health
curl -fsSI https://www.zongguili.com/
curl -fsS https://www.zongguili.com/api/zongguili/profile
```

The browser tabs should be:

```text
YUANFU: CYF | Yuanfu Chen
LZG:    LZG | Zonggui Li
```

## Nginx And TLS Notes

```text
www.yuanfu.cloud -> /srv/www/web1/dist, API proxy, /lzg preview
zongguili.com    -> /srv/www/zongguili, API proxy, lzg.html fallback
```

Both domain certificates are managed by Certbot under
`/etc/letsencrypt/live/`. Do not edit Nginx or certificate settings during a
normal UI/content deployment. Only do so when the task explicitly involves
domain routing, HTTPS, or server configuration.
