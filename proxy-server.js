const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')

const app = express()

// Set up CORS middleware to allow requests from the origin of your React app with credentials
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
)

// Set up custom middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

// Set up proxy middleware to forward requests to the API server
app.use(
  '/api',
  createProxyMiddleware({
    // target: 'http://localhost:5289',

    target: 'https://monolivia.com',
    changeOrigin: true,

    // secure: true,
    onProxyRes: (proxyRes, req, res) => {
      // Set the Access-Control-Allow-Origin header
      proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      res.setHeader('Access-Control-Allow-Credentials', 'true')
    }
  })
)

// Start the proxy server
app.listen(3001, () => {
  console.log('Proxy server listening on port 3001')
})
