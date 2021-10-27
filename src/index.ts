import { updateAnnotation } from './annotation'
import express from 'express'
import schedule from 'node-schedule'

process.env.TZ = 'Europe/Amsterdam' 

export const session = 
{
   ACCESS_TOKEN: 'Z0Zn4aBaAWktNgxK5uCeq0qV3kBsN5ImeY6ainpLcAc-VcWn0TeMaUHkDKRnHm8p',
   MIDNIGHT: new Date().setHours(24, 0, 0, 0),
   NEXT_UPDATE: new Date().setHours(new Date().getHours() + 1, 0, 0, 0)
}

schedule.scheduleJob('0 * * * *', () => updateAnnotation())

const app = express()
app.get('/', (req, res) => res.json(
{
   timeZone: process.env.TZ,
   dateNight: new Date(session.MIDNIGHT).toLocaleString('en-US'),
   dateNext: new Date(session.NEXT_UPDATE).toLocaleString('en-US'),
   dateNow: new Date().toLocaleString('en-US')
}))

app.listen(process.env.PORT || 3000, () => console.log('Application is running.'))
