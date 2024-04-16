import mongoose, { ClientSession } from 'mongoose'
import config from 'config'

import log from 'src/utils/logger'

const dbUri = config.get<string>('dbUri')
const dbName = config.get<string>('dbName')
const user = config.get<string>('dbUser')
const pass = config.get<string>('dbPass')
const connString = config.get<boolean>('connString')

export default async function connectToDB (): Promise<void> {
  try {
    if (connString) {
      await mongoose.connect(dbUri)
    } else {
      await mongoose.connect(dbUri, {
        dbName,
        user,
        pass
      })
    }
    log.info(`Connected to DB: ${dbUri}`)
  } catch (error) {
    log.error(error)
    process.exit(1)
  }
}

export async function getDbSession (): Promise<ClientSession> {
  return await mongoose.startSession()
}
