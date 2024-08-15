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
import { getCategories } from './handlers/get.categories';

const router = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *    Products:
 *      type:
 *      properties:
 *        id:
 *          type: integer
 *          description: The Product ID
 *          example: 1
 *        name:
 *          type: string
 *          description: The Product name
 *          example: Pantalón babucha
 *        price:
 *          type: number
 *          description: The Product price
 *          example: 300
 *        availability:
 *          type: boolean
 *          description: The Product availability
 *          example: true
 *        gender:
 *          type: string
 *          description: The Product gender category
 *          enum: ['femenino', 'masculino', 'unisex']
 *          example: femenino
 *        description:
 *          type: string
 *          description: The Product description
 *          example: Pantalón cómodo y moderno para uso diario
 *        quantity:
 *          type: integer
 *          description: The available quantity of the product
 *          example: 50
 *        imageUrl:
 *          type: string
 *          description: The URL of the Product image
 *          example: https://example.com/image.jpg
 *        categoryId:
 *          type: integer
 *          description: The ID of the category the product belongs to
 *          example: 2
 *        subcategoryId:
 *          type: integer
 *          description: The ID of the subcategory the product belongs to
 *          example: 5
 *        createdAt:
 *          type: string
 *          format: date-time
 *          description: The date and time the product was created
 *          example: 2023-01-01T10:00:00Z
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          description: The date and time the product was last updated
 *          example: 2023-01-05T12:00:00Z
 *    Categories:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: The Category ID
 *          example: 2
 *        name:
 *          type: string
 *          description: The Category name
 *          example: Ropa
 *        subcategories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SubCategories'
 *    SubCategories:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: The Subcategory ID
 *          example: 5
 *        name:
 *          type: string
 *          description: The Subcategory name
 *          example: Pantalones
 *        categoryId:
 *          type: integer
 *          description: The ID of the category this subcategory belongs to
 *          example: 2
 */

/**
 * @swagger
 * /api/products:
 *  get:
 *    summary: Get a list of products
 *    tags:
 *      - Products
 *    description: Return a list of products
 *    responses:
 *      200:
 *        description: Succesful response
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Products'
 *
 */
router.get('/products', handleInputErrors, getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *    summary: Get a product by ID
 *    tags:
 *      - Products
 *    description: Return a product based on its unique ID
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The ID of the product to retrieve
 *      required: true
 *      schema:
 *        type: integer
 *    responses:
 *      200:
 *        description: Successful Response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Products'
 *      404:
 *        description: Not Found
 *      400:
 *        description: Bad Request - Invalid ID
 */
router.get(
	'/products/:id',
	param('id').isInt().withMessage('ID no válido'),
	handleInputErrors,
	getProductById
);

/**
 * @swagger
 * /api/products:
 *  post:
 *    summary: Creates a new product
 *    tags:
 *      - Products
 *    description: Return a new record in the database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Pantalón de corderoy"
 *              price:
 *                type: number
 *                example: 9000
 *              availability:
 *                type: boolean
 *                description: Availability of the product
 *                example: true
 *              gender:
 *                type: string
 *                description: Gender category of the product
 *                enum: [femenino, masculino, unisex]
 *                example: femenino
 *              description:
 *                type: string
 *                description: Detailed description of the product
 *                example: "Pantalón cómodo y elegante para cualquier ocasión."
 *              quantity:
 *                type: integer
 *                description: The quantity available
 *                example: 50
 *              imageUrl:
 *                type: string
 *                description: URL to the product image
 *                example: "https://example.com/image.jpg"
 *              categoryId:
 *                type: integer
 *                description: ID of the category to which the product belongs
 *                example: 2
 *              subcategoryId:
 *                type: integer
 *                description: ID of the subcategory to which the product belongs
 *                example: 1
 *    responses:
 *      201:
 *        description: Successful Response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Products'
 *      400:
 *        description: Bad Request - Invalid input data
 *
 */
router.post(
	'/products',

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

/**
 * @swagger
 * /api/categories:
 *  post:
 *    summary: Creates a new category
 *    tags:
 *      - Categories
 *    description: Creates a new category record in the database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The name of the category
 *                example: "Campera"
 *              subcategories:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/SubCategories'
 *    responses:
 *      201:
 *        description: Category created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Categories'
 *      400:
 *        description: Bad Request - Invalid input data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Invalid input data"
 */

router.post(
	'/categories',
	body('name')
		.trim()
		.notEmpty()
		.withMessage('El nombre de la categoría no puede ir vacío')
		.isLength({ min: 1 })
		.withMessage(
			'El nombre de la categoría no puede ser solo espacios en blanco'
		),
	handleInputErrors,
	createCategory
);

/**
 * @swagger
 * /api/categories:
 *  get:
 *    summary: Retrieves a list of categories
 *    tags:
 *      - Categories
 *    description: Returns a list of all categories available in the database
 *    responses:
 *      200:
 *        description: A list of categories
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Categories'
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Internal server error"
 */

router.get('/categories', getCategories);
/**
 * @swagger
 * /api/subcategories:
 *  post:
 *    summary: Creates a new subcategory
 *    tags:
 *      - SubCategories
 *    description: Creates a new subcategory record in the database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The name of the subcategory
 *                example: "XXL"
 *              categoryId:
 *                type: integer
 *                description: ID of the category to which the subcategory belongs
 *                example: 2
 *    responses:
 *      201:
 *        description: Subcategory created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SubCategories'
 *      400:
 *        description: Bad Request - Invalid input data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Invalid input data"
 */

router.post(
	'/subcategories',
	body('name')
		.trim()
		.notEmpty()
		.withMessage('El nombre de la subcategoría no puede ir vacío')
		.isLength({ min: 1 })
		.withMessage(
			'El nombre de la subcategoría no puede ser solo espacios en blanco'
		),
	body('categoryId').notEmpty().withMessage('Debes asignar una categoría'),
	handleInputErrors,
	createSubcategory
);

/**
 * @swagger
 * /api/subcategories:
 *  get:
 *    summary: Retrieves a list of subcategories
 *    tags:
 *      - SubCategories
 *    description: Returns a list of all subcategories available in the database
 *    responses:
 *      200:
 *        description: A list of subcategories
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/SubCategories'
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Internal server error"
 */

router.get('/subcategories', getCategories);

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *    summary: Updates a product with user input
 *    tags:
 *      - Products
 *    description: Returns the updated product
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The ID of the product to retrieve
 *      required: true
 *      schema:
 *        type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Remera"
 *              price:
 *                type: number
 *                example: 12000
 *              availability:
 *                type: boolean
 *                example: true
 *              gender:
 *                type: string
 *                example: femenino
 *              description:
 *                type: string
 *                example: "Remera de algodón básica."
 *              quantity:
 *                type: integer
 *                example: 50
 *              imageUrl:
 *                type: string
 *                example: "https://example.com/image.jpg"
 *              categoryId:
 *                type: integer
 *                example: 2
 *              subcategoryId:
 *                type: integer
 *                example: 1
 *    responses:
 *      200:
 *        description: Successful Response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Products'
 *      400:
 *        description: Bad Request - Invalid ID or Invalid input data
 *      404:
 *        description: Product Not Found
 */
router.put(
	'/products/:id',
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

/**
 * @swagger
 *  /api/products/{id}:
 *    patch:
 *      summary: Update Product availability
 *      tags:
 *        - Products
 *      description: Returns the updated availability
 *      parameters:
 *      - in: path
 *        name: id
 *        description: The ID of the product to retrieve
 *        required: true
 *        schema:
 *          type: integer
 *      responses:
 *        200:
 *          description: Successful Response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Products'
 *        400:
 *          description: Bad Request - Invalid ID
 *        404:
 *          description: Product Not Found
 */
router.patch(
	'/products/:id',
	param('id').isInt().withMessage('ID no válido'),
	handleInputErrors,
	updateAvailability
);

/**
 * @swagger
 *  /api/products/{id}:
 *    delete:
 *      summary: Delete a Product by a given ID
 *      tags:
 *        - Products
 *      description: Returns a confirmation message
 *      parameters:
 *      - in: path
 *        name: id
 *        description: The ID of the product to delete
 *        required: true
 *        schema:
 *          type: integer
 *      responses:
 *        200:
 *          description: Successful Response
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                value: 'Producto eliminado'
 *        400:
 *          description: Bad Request - Invalid ID
 *        404:
 *          description: Product Not Found
 *
 */
router.delete(
	'/products/:id',
	param('id').isInt().withMessage('ID no válido'),
	handleInputErrors,
	deleteProduct
);

export default router;
