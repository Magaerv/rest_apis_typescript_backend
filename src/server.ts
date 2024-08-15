import express from 'express';
import colors from 'colors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec, { swaggerUiOptions } from './config/swagger';
import productsRouter from './router';
import db from './config/db';

export async function connectDb() {
	try {
		await db.authenticate();
		await db.sync();
		console.log(colors.blue.bold('Conexión exitosa con la DB'));
	} catch (error) {
		console.log(colors.red.bold('Hubo un error al conectar a la DB'));
	}
}

connectDb();

const server = express();

server.use(express.json());

server.use('/api', productsRouter);

server.use(
	'/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
