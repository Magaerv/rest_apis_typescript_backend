import { Router } from 'express';
import { body, param } from 'express-validator';
import {
	createCategory,
	createProduct,
	createSubcategory,
	deleteProduct,
	getProductById,
	getProducts,
	updateAvailability,
	updateProduct,
} from './handlers';
import { handleInputErrors } from './middleware';

const router = Router();

router.get('/', handleInputErrors, getProducts);

router.get(
	'/:id',
	param('id').isInt().withMessage('ID no válido'),
	handleInputErrors,
	getProductById
);

router.post(
	'/',

	body('name')
		.notEmpty()
		.withMessage('El nombre del producto no puede ir vacío')
		.isString()
		.withMessage('El nombre del producto debe ser una cadena de texto'),

	body('price')
		.isNumeric()
		.withMessage('Valor no válido')
		.notEmpty()
		.withMessage('El precio del producto no puede ir vacío')
		.custom(value => value > 0)
		.withMessage('Precio no válido'),

	body('availability')
		.optional()
		.isBoolean()
		.withMessage('La disponibilidad debe ser un valor booleano'),

	body('gender')
		.notEmpty()
		.withMessage('El género no puede ir vacío')
		.isIn(['femenino', 'masculino', 'unisex'])
		.withMessage('El género debe ser femenino, masculino o unisex'),

	body('description')
		.optional()
		.isString()
		.withMessage('La descripción debe ser una cadena de texto'),

	body('quantity')
		.isInt({ min: 0 })
		.withMessage('La cantidad debe ser un número entero mayor o igual a 0')
		.notEmpty()
		.withMessage('La cantidad no puede ir vacía'),

	body('imageUrl')
		.optional()
		.isURL()
		.withMessage('La URL de la imagen no es válida'),

	body('categoryId')
		.isInt()
		.withMessage('El ID de la categoría debe ser un número entero')
		.notEmpty()
		.withMessage('El ID de la categoría no puede ir vacío'),

	body('subcategoryId')
		.isInt()
		.withMessage('El ID de la subcategoría debe ser un número entero')
		.notEmpty()
		.withMessage('El ID de la subcategoría no puede ir vacío'),

	handleInputErrors,

	createProduct
);

router.post(
	'/category',
	body('name')
		.notEmpty()
		.withMessage('El nombre de la categoría no puede ir vacío'),
	createCategory
);

router.post(
	'/subcategory',
	body('name')
		.notEmpty()
		.withMessage('El nombre de la subcategoría no puede ir vacío'),
	body('categoryId').notEmpty().withMessage('Debes asignar una categoría'),
	createSubcategory
);

router.put(
	'/:id',
	param('id').isInt().withMessage('ID no válido'),
	body('name')
		.notEmpty()
		.withMessage('El nombre del producto no puede ir vacío'),

	body('price')
		.isNumeric()
		.withMessage('Valor no válido')
		.notEmpty()
		.withMessage('El precio del producto no puede ir vacío')
		.custom(value => value > 0)
		.withMessage('Precio no válido'),

	body('availability').isBoolean().withMessage('Valor no válido'),
	handleInputErrors,
	updateProduct
);

router.patch(
	'/:id',
	param('id').isInt().withMessage('ID no válido'),
	handleInputErrors,
	updateAvailability
);

router.delete(
	'/:id',
	param('id').isInt().withMessage('ID no válido'),
	handleInputErrors,
	deleteProduct
);

export default router;
