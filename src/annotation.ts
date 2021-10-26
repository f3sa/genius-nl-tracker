import Axios from 'axios'
import { session } from '.'
import { getStatistics } from './tracker'

const BODY = (statistics: string[]) =>
{
   return {
      "annotation": { "body": { "markdown": statistics.join('\n') } }
   }
}

export async function updateAnnotation()
{
   try
   {
      const statistics = await getStatistics()
      
      for (const stat of statistics)
         console.log(stat)

      try
      {
         const response = await Axios.put(
            'https://api.genius.com/annotations/20112143', BODY([lastUpdate(), volgendeUpdate(), ...statistics]),
            {
               headers: { Authorization: `Bearer ${session.ACCESS_TOKEN}` }
            }
         )

         console.log(`\nResponse status code: ${response.status}`)
         console.log('Annotation successfully updated!')      
      } 
      catch (error: any)
      {
         const meta = error.response.data.meta

         console.log(`\nResponse status code: ${meta.status}`)
         console.log(`Message: ${meta.message}`)
      }
   }
   catch (error: any) 
   {
      console.error('Couldn\'t get the statistics of the community.', error)
   }
}

const lastUpdate = (): string =>
{
   const date = new Date()
   .toLocaleString('nl-BE', { 
      year: '2-digit', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit'}
   ).replace(' ', '</b> om <b>')

   return `<small>Laatst geüpdatet: <b>${date}</b></small>`
}

const volgendeUpdate = (): string =>
{
   const date = new Date(new Date().getTime() + 30 * 60 * 1000)
   .toLocaleString('nl-BE', { 
      year: '2-digit', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit'}
   ).replace(' ', '</b> om <b>')

   return `<small>Volgende update: <b>${date}</b></small>`
}