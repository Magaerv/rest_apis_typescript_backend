import { Request, Response } from 'express';
import Product from '../models/Product.model';

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const product = await Product.findByPk(id);
		if (!product) {
			return res.status(404).json({ error: 'Producto no encontrado' });
		}

		await product.destroy();
		res.json({ data: 'Producto eliminado' });
	} catch (error) {
		console.log(error);
	}
};
