import express from 'express';
import colors from 'colors';
import productsRouter from './router';
import db from './config/db';

async function connectDb() {
	try {
		await db.authenticate();
		await db
			.sync()
			.then(() => console.log(colors.blue.bold('Conexión exitosa a la DB')));
	} catch (error) {
		//console.log(error);
		console.log(colors.red.bold('Hubo un error al conectar a la DB'));
	}
}

connectDb();

const server = express();

server.use(express.json());

server.use('/api/products', productsRouter);
// server.use('/api/services', servicesRouter);

server.get('/api', (req, res) => {
	res.json({ msg: 'Desde API' });
});

export default server;
