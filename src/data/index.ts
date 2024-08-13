import { exit } from 'node:process';
import db from '../config/db';
//import Product from '../models/Product.model';

const clearProductsTest = async () => {
	try {
		//await db.authenticate();
		//console.log('Conexión con Database');
		// await Product.destroy({ where: {}, truncate: true });
		//await db.query('TRUNCATE TABLE products RESTART IDENTITY CASCADE');
		await db.sync({ force: true });
		console.log('Datos eliminados correctamente');
		exit(0);
	} catch (error) {
		console.log(error);
		exit(1);
	}
};

if (process.argv[2] === '--clear') {
	clearProductsTest();
}
