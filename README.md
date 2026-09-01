# Port Manager landing site

The private source repository for the Port Manager marketing site. The public
desktop app and its release artifacts remain in
[`yonatan2021/ports-mcp`](https://github.com/yonatan2021/ports-mcp).

## Local development

```sh
npm ci
npm test
SITE_URL=https://ports.bersaglio.work npm run build
```

Vercel deploys this repository directly. Do not add application server code,
desktop code, MCP code, release artifacts, or credentials here.
