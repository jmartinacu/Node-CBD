import express from 'express'

import userRouter from 'src/routes/user.routes'
import auhtRouter from 'src/routes/auth.routes'
import groupRouter from 'src/routes/group.routes'
import paymentRouter from 'src/routes/payment.routes'

const router = express.Router()

router.get('/healthcheck', (_, res) => {
  res.sendStatus(200)
})

router.use(userRouter)

router.use(auhtRouter)

router.use(groupRouter)

router.use(paymentRouter)

export default router
