const express = require('express')
const httpMockMiddleware = require('@openeagle/http-mock-middleware')

const app = express()
httpMockMiddleware(app, require('../http.mock.config'))

app.listen(999)
console.log(`url: http://localhost:999`)
