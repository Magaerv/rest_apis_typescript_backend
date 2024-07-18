import { Request, Response } from 'express';
import Product from '../models/Product.model';

export const getProductById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const product = await Product.findByPk(id);
		if (!product) {
			return res.status(404).json({ error: 'Producto no encontrado' });
		}
		res.json({ data: product });
	} catch (error) {
		console.log(error);
	}
};
