import { Request, Response } from 'express';
import Product from '../models/Product.model';

export const createProduct = async (req: Request, res: Response) => {
	try {
		let { price } = req.body;
		if (price < 0 || price > 100000) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Precio fuera del rango permitido' }] });
		}

		const product = await Product.create(req.body);
		res.status(201).json({ data: product });
	} catch (error) {
		console.log(error);
	}
};
