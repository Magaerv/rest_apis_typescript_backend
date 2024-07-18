import { Request, Response } from 'express';
import Product from '../models/Product.model';

export const getProducts = async (req: Request, res: Response) => {
	try {
		const products = await Product.findAll({
			order: [['price', 'ASC']],
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
		});
		res.json({ data: products });
	} catch (error) {
		console.log(error);
	}
};
