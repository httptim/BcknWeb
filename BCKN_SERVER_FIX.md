# Bckn Server CORS Fix Required

## Issue Confirmed
The Bckn server is sending duplicate `Access-Control-Allow-Origin` headers on GET/POST requests (but not OPTIONS).

### Test Results:
```bash
# OPTIONS request (preflight) - CORRECT ✓
$ curl -I -X OPTIONS https://bckn.dev/work/day
access-control-allow-origin: *

# GET request - DUPLICATE HEADERS ✗
$ curl -I https://bckn.dev/work/day
access-control-allow-origin: *
access-control-allow-origin: *
```

## Root Cause
The Express CORS middleware is working correctly for OPTIONS requests, but something is adding an extra `Access-Control-Allow-Origin: *` header to other requests.

## How to Fix

### 1. Check for Multiple CORS Configurations
Look for these common causes in your Bckn server code:

```javascript
// BAD - Don't do this:
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// GOOD - Use only one:
app.use(cors());
```

### 2. Check Route-Specific Headers
Search for any route handlers adding CORS headers:

```javascript
// BAD - Remove these if using cors() middleware:
app.get('/work/day', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  // ... rest of handler
});
```

### 3. Check Reverse Proxy (Nginx/Apache)
If using a reverse proxy, ensure it's not adding CORS headers when the app already does:

**Nginx - Remove these if app handles CORS:**
```nginx
# Remove or comment out:
# add_header 'Access-Control-Allow-Origin' '*';
```

### 4. Quick Test
After fixing, verify with:
```bash
curl -I https://bckn.dev/work/day | grep -c "access-control-allow-origin"
# Should return: 1
```

## Temporary Client-Side Workaround
Until the server is fixed, users can:
1. Use a browser extension to modify CORS headers
2. Run the wallet locally with `npm start` (development mode)

The wallet application itself is correctly configured and will work once the server stops sending duplicate headers.