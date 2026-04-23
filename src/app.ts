import fastify from 'fastify'
import { ZodError } from 'zod'
import { productsRoutes } from './modules/products/routes.js'

const app = fastify()

app.get('/health', async (_request, reply) => {
  return await reply.send({ status: 'Everthing is working' })
})
app.register(productsRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.issues,
    })
  }

  console.error(error)

  return reply.status(500).send({
    message: 'Internal server error',
  })
})

export { app }
