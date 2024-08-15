import { Request, Response } from 'express';
import Subcategory from '../models/SubCategory.model';

export const getSubcategories = async (req: Request, res: Response) => {
	try {
		const subcategories = await Subcategory.findAll({
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
		});
		res.json({ data: subcategories });
	} catch (error) {
		console.log(error);
	}
};
