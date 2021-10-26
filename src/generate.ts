import express from 'express'
import Axios from 'axios'
import { API } from './config'

const app = express()

app.get('/', (req, res) =>
{
   res.redirect(
      'https://api.genius.com/oauth/authorize' +
      '?client_id=' + API.client_id +
      '&redirect_uri=' + API.redirect_uri +
      '&scope=' + API.scopes +
      '&state=0' +
      '&response_type=code'
   )
})

app.get('/callback', async (req, res) =>
{
   try
   {
      const response = await Axios.post('https://api.genius.com/oauth/token', 
      {
         code: req.query.code,
         client_id: API.client_id,
         client_secret: API.secret_id,
         redirect_uri: API.redirect_uri,
         response_type: 'code',
         grant_type: 'authorization_code',
      })
   
      res.json(response.data)
   }
   catch (error)
   {
      res.status(400).json(error)
   }
})

app.listen(3000, () => console.log('This is a tool used to attain an access token for Genius.'))