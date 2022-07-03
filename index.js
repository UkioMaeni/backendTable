const express = require('express')
const router = require('./Routes/routes')
const cors=require('cors')

const app=express()
app.use(express.json())
app.use(cors())
app.use('/api',router)
app.listen(5000,()=>console.log('server start'))

