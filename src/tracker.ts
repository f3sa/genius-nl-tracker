import fs from 'fs'
import Axios from 'axios'
import { session } from '.'
import { prefix, toArray } from './config'

export async function getStatistics(): Promise<string[]>
{
   const lastStats = require('../lastStats.json')
   const users = toArray(require('../users.json'))
   
   const nowStats: any = {}
   const output: string[] = []

   return new Promise<string[]>((resolveArray, rejectArray) => 
   {
      const stats: any[] = [0, 0, 0, 0, 0, 0]
      
      Promise.all(users.map(id => 
      {
         return new Promise<void>(resolveUser => 
         {
            Axios.get(`https://api.genius.com/users/${id}`,
            {
               headers: { Authorization: `Bearer ${session.ACCESS_TOKEN}` }
            })
            .then((response: any) => 
            {      
               const json = response.data.response.user
                  
               stats[0] += json.stats.transcriptions_count
               stats[1] += json.stats.annotations_count
               stats[2] += json.stats.answers_count
               stats[3] += json.stats.questions_count
               stats[4] += json.stats.forum_posts_count
               stats[5] += json.iq
            })
            .then(() => resolveUser())
         })
      }))
      .then(() => 
      {
         for (let i = 0; i < prefix.length; i++)
         {
            const yesterday = lastStats[i][0]
            const today = stats[i] - lastStats[i][1]

            const evolution = ((today - yesterday) / yesterday) * 100
            let evolutionString = `(${(evolution  > 0 ? '+' : '') + Math.round(evolution)}%)`

            if (evolution === Infinity) evolutionString = '(+100%)'
            if (evolution === -Infinity) evolutionString = ''
            if (isNaN(evolution)) evolutionString = ''
            
            output.push(' ')
            output.push(`${prefix[i]}: **${stats[i].toLocaleString('en-US')} totaal**`)
            output.push(`<small> • Gisteren: ${yesterday.toLocaleString('en-US')}</small>`)
            output.push(` • **Vandaag**: ${today.toLocaleString('en-US')} ${evolutionString}`)

            nowStats[i] = [today, stats[i]]
         }
      })
      .then(() => 
      {
         const now = new Date()
      
         if (now.getTime() >= session.MIDNIGHT)
         {
            fs.writeFileSync('lastStats.json', JSON.stringify(nowStats))
            session.MIDNIGHT = now.setHours(24, 0, 0, 0)
         }
      })
      .then(() => resolveArray(output))
      .catch(error => rejectArray(error))
   })
}