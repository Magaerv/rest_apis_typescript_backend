import { Request, Response } from 'express';
import Category from '../models/Category.model';

export const createCategory = async (req: Request, res: Response) => {
	try {
		const category = await Category.create(req.body);
		res.status(201).json({ data: category });
	} catch (error) {
		console.log(error);
	}
};
