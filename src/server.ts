import fastify from 'fastify'
import oauthPlugin from "@fastify/oauth2";

const server = fastify()

server.register(oauthPlugin, {
  name: 'googleOAuth2',
  scope: ['profile', 'email'],
  credentials: {
    client: {
      id: '1048568934801-s9b0i2ubpktif27k7g5de50591244irk.apps.googleusercontent.com',
      secret: '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'
    },
    auth: oauthPlugin.GOOGLE_CONFIGURATION
  },
  // register a fastify url to start the redirect flow
  startRedirectPath: '/login/google',
  // facebook redirect here after the user login
  callbackUri: 'http://localhost:4000/auth/google/callback'
})

server.get('/auth/google/callback', async function (request, reply) {
  const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
  console.log(token)

  return token
  
})

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.listen({ port: 4000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})