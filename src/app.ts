/* eslint-disable @typescript-eslint/no-misused-promises */
import dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import config from 'config'

import log from 'src/utils/logger'
import router from 'src/routes/index'
import deserializeUser from 'src/middleware/deserializeUser'
import connectToDB from 'src/utils/connnectToDB'


const app = express()

app.use(deserializeUser)

app.use(express.json())

app.use(router)

const port: number = config.get('port') ?? 8080

app.listen(port, () => {
  void connectToDB()
  log.info(`App started at http://localhost:${port}`)
})
