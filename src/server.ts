import fastify from 'fastify'
import oauthPlugin from "@fastify/oauth2";
import axios from "axios";

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
  startRedirectPath: '/auth/google',
  // facebook redirect here after the user login
  callbackUri: 'http://localhost:4000/auth/google/callback'
})

server.get('/auth/google/callback', async function (request, reply) {
  try {
    const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
    const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: 'Bearer ' + token.access_token,
      },
    });
    console.log('Axios: ', response.data);
    return response.data

  } catch (error) {
    console.error(error);
    return error
  }

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