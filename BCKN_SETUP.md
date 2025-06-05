# BcknWeb Deployment Troubleshooting

## CORS Configuration Issue (Resolved)

The duplicate CORS headers issue appears to be caused by the deployment environment, not the Bckn server itself.

### Investigation Results
- The Bckn server correctly uses Express CORS middleware (`app.use(cors())`)
- The duplicate headers (`Access-Control-Allow-Origin: *, *`) suggest headers are being added twice
- This typically happens when a proxy or CDN is adding headers on top of the server's headers

### Potential Causes
1. **Vercel's Edge Network** might be adding CORS headers automatically
2. **Cloudflare or other CDN** if bckn.dev uses one, might be adding duplicate headers
3. **Reverse proxy configuration** between the Bckn server and the internet

### Option 3: Temporary Development Workaround
For local development only, you can use a proxy:

1. Install a CORS proxy extension in your browser
2. Or run the wallet locally with: `npm start` and configure proxy in package.json:

```json
"proxy": "https://bckn.dev"
```

## Verification
After fixing, the server should return headers like:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Additional Server Requirements
- Ensure all API endpoints are accessible: `/login`, `/transactions`, `/names/:name`, `/ws`
- WebSocket endpoint should be available at `wss://bckn.dev/ws`
- The server should support the same API structure as Krist

## Testing
You can test CORS headers with:
```bash
curl -I -X OPTIONS https://bckn.dev/work/day \
  -H "Origin: https://your-vercel-domain.vercel.app" \
  -H "Access-Control-Request-Method: GET"
```