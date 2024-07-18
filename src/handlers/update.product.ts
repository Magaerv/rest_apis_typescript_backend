import { Request, Response } from 'express';
import Product from '../models/Product.model';

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const product = await Product.findByPk(id);
		if (!product) {
			return res.status(404).json({ error: 'Producto no encontrado' });
		}

		await product.update(req.body);
		await product.save();
		res.json({ data: product });
	} catch (error) {
		console.log(error);
	}
};
