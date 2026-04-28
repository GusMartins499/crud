import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { ZodError } from 'zod'
import packageJson from '../package.json' with { type: 'json' }
import { productsRoutes } from './modules/products/routes.js'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Vitatrack API',
      version: packageJson.version,
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    syntaxHighlight: {
      activate: true,
      theme: 'tomorrow-night',
    },
  },
})

app.get('/health', async (_request, reply) => {
  return await reply.send({ status: 'Everthing is working' })
})
app.register(productsRoutes)

app.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    })
  }

  if (isResponseSerializationError(error)) {
    request.log.error({ err: error }, 'response serialization error')
    return reply.status(500).send({
      message: 'Internal server error',
    })
  }

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
