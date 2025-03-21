const fastify = require('fastify')({ logger: true });

// Define a sample route
fastify.get('/', async (request, reply) => {
  return { message: 'Hello, Fastify!' };
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server is running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
