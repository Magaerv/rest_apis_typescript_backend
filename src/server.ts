import express from 'express';
import colors from 'colors';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
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

const corsOptions: CorsOptions = {
	origin: function (origin, callback) {
		if (
			!origin ||
			origin === process.env.FRONTEND_URL ||
			origin === 'http://localhost:5173'
		) {
			callback(null, true);
		} else {
			console.error(`CORS error: ${origin} no está permitido.`);
			callback(new Error('Error de CORS'));
		}
	},
};

server.use(cors(corsOptions));

server.use(express.json());

server.use(morgan('dev'));

server.use('/api', productsRouter);

server.use(
	'/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
