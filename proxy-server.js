const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')

const app = express()

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin)
    },
    credentials: true
  })
)

// Set up proxy middleware to forward requests to the API server
app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://monolivia.com',

    // target: 'http://localhost:5295',

    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
      // Set the Access-Control-Allow-Origin header
      proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true'
    }
  })
)

// Start the proxy server
app.listen(3001, () => {
  console.log('Proxy server listening on port 3001')
})
