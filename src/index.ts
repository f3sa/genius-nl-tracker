import { updateAnnotation } from './annotation'
import express from 'express'
import schedule from 'node-schedule'

process.env.TZ = 'Europe/Amsterdam' 

export const session = 
{
   ACCESS_TOKEN: 'ACCESS_TOKEN_HERE',
   MIDNIGHT: new Date().setHours(24, 0, 0, 0)
}

schedule.scheduleJob('*/30 * * * *', () => updateAnnotation())

const app = express()
app.get('/', (req, res) => res.json({
   TZ: process.env.TZ,
   midnight: new Date(session.MIDNIGHT).toLocaleString('en-US'),
   now: new Date().toLocaleString('en-US')
}))

app.listen(process.env.PORT || 3000, () => console.log('working'))
