import fastify from 'fastify'

const app = fastify()

app.get('/health', async (_request, reply) => {
  return await reply.send({ status: 'Everthing is working' })
})

export { app }
