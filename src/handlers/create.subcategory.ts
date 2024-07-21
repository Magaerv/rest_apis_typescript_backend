import { Request, Response } from 'express';
import Subcategory from '../models/SubCategory.model';

export const createSubcategory = async (req: Request, res: Response) => {
	try {
		const subcategory = await Subcategory.create(req.body);
		res.status(201).json({ data: subcategory });
	} catch (error) {
		console.log(error);
	}
};
