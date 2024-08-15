import { Request, Response } from 'express';
import Category from '../models/Category.model';
import Subcategory from '../models/SubCategory.model';

export const getCategories = async (req: Request, res: Response) => {
	try {
		const categories = await Category.findAll({
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
			include: [
				{
					model: Subcategory,
					as: 'subcategories',
					attributes: {
						exclude: ['createdAt', 'updatedAt'],
					},
				},
			],
		});
		res.json({ data: categories });
	} catch (error) {
		console.log(error);
	}
};
