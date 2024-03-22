import mongoose from 'mongoose'
import config from 'config'

import log from 'src/utils/logger'

const dbUri = config.get<string>('dbUri')
const dbName = config.get<string>('dbName')
const user = config.get<string>('dbUser')
const pass = config.get<string>('dbPass')

export default async function connectToDB (): Promise<void> {
  try {
    await mongoose.connect(dbUri, {
      dbName,
      user,
      pass
    })
    log.info(`Connected to DB: ${dbUri}${dbName}`)
  } catch (error) {
    log.error(error)
    process.exit(1)
  }
}
