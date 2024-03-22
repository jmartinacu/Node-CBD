import express from 'express'

import userRouter from 'src/routes/user.routes'
import auhtRouter from 'src/routes/auth.routes'

const router = express.Router()

router.get('/healthcheck', (_, res) => {
  res.sendStatus(200)
})

router.use(userRouter)

router.use(auhtRouter)

export default router
