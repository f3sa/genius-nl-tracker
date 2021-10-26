export const prefix: string[] = [
   'Transcripties 📝',
   'Annotaties ✍️',
   'Vragen beantwoord 🙋‍♂️',
   'Vragen gesteld ❓',
   'Forum Posts 📥',
   'IQ van de community 💡'
]

export const toArray = (users: any): string[] => Object.keys(users).map((_) => users[_])

export const API = 
{
   website_url:  'http://localhost:3000',
   redirect_uri: 'http://localhost:3000/callback',
   client_id: 'CLIENT_ID',
   secret_id : 'SECRET_ID',
   scopes: 'me create_annotation manage_annotation vote',
 }