import request from 'supertest';
import server from '../../server';

describe('Product API', () => {
	let categoryId: number;
	let subcategoryId: number;
	let productId: number;

	beforeAll(async () => {
		categoryId = await createCategory('New Category');
		subcategoryId = await createSubcategory('New Subcategory', categoryId);
	});

	describe('POST /api/products', () => {
		it('should create a new product', async () => {
			const newProduct = createProductData(
				'T-shirt',
				799,
				true,
				'unisex',
				'Latest T-shirt',
				50,
				'http://example.com/t-shirt.jpg',
				categoryId,
				subcategoryId
			);
			const response = await request(server)
				.post('/api/products')
				.send(newProduct);

			expect(response.statusCode).toBe(201);
			expect(response.body.data).toHaveProperty('id');
			expect(response.body.data.name).toBe(newProduct.name);
		});

		it('should return validation error if name is missing', async () => {
			const newProduct = createProductData(
				'',
				799,
				true,
				'unisex',
				'Latest T-shirt',
				50,
				'http://example.com/t-shirt.jpg',
				categoryId,
				subcategoryId
			);
			const response = await request(server)
				.post('/api/products')
				.send(newProduct);

			expect(response.statusCode).toBe(400);
			expect(response.body.errors[0].msg).toBe(
				'El nombre del producto no puede ir vacío'
			);
		});

		it('should return validation error for invalid price', async () => {
			const newProduct = createProductData(
				'Invalid Price Product',
				-1,
				true,
				'unisex',
				'Invalid price test',
				10,
				'http://example.com/invalid.jpg',
				categoryId,
				subcategoryId
			);
			const response = await request(server)
				.post('/api/products')
				.send(newProduct);

			expect(response.statusCode).toBe(400);
			expect(response.body.errors[0].msg).toBe('Precio no válido');
		});

		it('should handle extreme values', async () => {
			const newProduct = createProductData(
				'Extreme Product',
				100001,
				true,
				'unisex',
				'Extreme value test',
				0,
				'http://example.com/extreme.jpg',
				categoryId,
				subcategoryId
			);
			const response = await request(server)
				.post('/api/products')
				.send(newProduct);

			expect(response.statusCode).toBe(400);
			expect(response.body.errors[0].msg).toBe(
				'Precio fuera del rango permitido'
			);
		});
	});

	describe('GET /api/products', () => {
		it('should return all products', async () => {
			const response = await request(server).get('/api/products');

			expect(response.statusCode).toBe(200);
			expect(Array.isArray(response.body.data)).toBe(true);
			expect(response.body.data.length).toBeGreaterThan(0);
		});
	});

	describe('GET /api/products/:id', () => {
		beforeAll(async () => {
			const newProduct = createProductData(
				'Specific Product',
				999,
				true,
				'unisex',
				'Product for specific GET request',
				100,
				'http://example.com/specific-product.jpg',
				categoryId,
				subcategoryId
			);
			const response = await request(server)
				.post('/api/products')
				.send(newProduct);
			productId = response.body.data.id;
		});

		it('should return a product with the given id', async () => {
			const response = await request(server).get(`/api/products/${productId}`);

			expect(response.statusCode).toBe(200);
			expect(response.body.data).toHaveProperty('id', productId);
			expect(response.body.data.name).toBe('Specific Product');
		});

		it('should return 404 if product does NOT exist', async () => {
			const response = await request(server).get('/api/products/999999999');

			expect(response.statusCode).toBe(404);
			expect(response.body.error).toBe('Producto no encontrado');
		});
	});

	describe('PUT /api/products/:id', () => {
		beforeAll(async () => {
			const newProduct = createProductData(
				'Product to Update',
				100,
				true,
				'unisex',
				'Product before update',
				10,
				'http://example.com/product.jpg',
				categoryId,
				subcategoryId
			);
			const response = await request(server)
				.post('/api/products')
				.send(newProduct);
			productId = response.body.data.id;
		});

		it('should update a product successfully', async () => {
			const updatedProduct = createProductData(
				'Updated Product',
				150,
				false,
				'femenino',
				'Updated description',
				20,
				'http://example.com/updated.jpg',
				categoryId,
				subcategoryId
			);
			const response = await request(server)
				.put(`/api/products/${productId}`)
				.send(updatedProduct);

			expect(response.statusCode).toBe(200);
			expect(response.body.data.name).toBe(updatedProduct.name);
			expect(response.body.data.price).toBe(updatedProduct.price);
			expect(response.body.data.availability).toBe(updatedProduct.availability);
			expect(response.body.data.gender).toBe(updatedProduct.gender);
			expect(response.body.data.description).toBe(updatedProduct.description);
			expect(response.body.data.quantity).toBe(updatedProduct.quantity);
			expect(response.body.data.imageUrl).toBe(updatedProduct.imageUrl);
		});

		it('should return error if product does NOT exist', async () => {
			const updatedProduct = createProductData(
				'Non-existent Product',
				200,
				true,
				'masculino',
				'Non-existent product',
				30,
				'http://example.com/non-existent.jpg',
				categoryId,
				subcategoryId
			);
			const response = await request(server)
				.put('/api/products/999999999')
				.send(updatedProduct);

			expect(response.statusCode).toBe(404);
			expect(response.body.error).toBe('Producto no encontrado');
		});

		it('should return validation error for invalid data', async () => {
			const invalidProduct = createProductData(
				'',
				-50,
				true,
				'unisex',
				'Invalid product',
				5,
				'http://example.com/invalid.jpg',
				categoryId,
				subcategoryId
			);
			const response = await request(server)
				.put(`/api/products/${productId}`)
				.send(invalidProduct);

			expect(response.statusCode).toBe(400);
			expect(response.body.errors).toContainEqual(
				expect.objectContaining({
					msg: 'El nombre del producto no puede ir vacío',
				})
			);
			expect(response.body.errors).toContainEqual(
				expect.objectContaining({ msg: 'Precio no válido' })
			);
		});
	});

	describe('DELETE /api/products/:id', () => {
		beforeAll(async () => {
			const newProduct = createProductData(
				'Product to Delete',
				200,
				true,
				'unisex',
				'This product will be deleted',
				15,
				'http://example.com/delete.jpg',
				categoryId,
				subcategoryId
			);
			const response = await request(server)
				.post('/api/products')
				.send(newProduct);
			productId = response.body.data.id;
		});

		it('should delete a product successfully', async () => {
			const response = await request(server).delete(
				`/api/products/${productId}`
			);

			expect(response.statusCode).toBe(200);
			expect(response.body.data).toBe('Producto eliminado');

			const getResponse = await request(server).get(
				`/api/products/${productId}`
			);
			expect(getResponse.statusCode).toBe(404);
			expect(getResponse.body.error).toBe('Producto no encontrado');
		});

		it('should return error if product does NOT exist', async () => {
			const response = await request(server).delete('/api/products/999999');

			expect(response.statusCode).toBe(404);
			expect(response.body.error).toBe('Producto no encontrado');
		});
	});

	it('should return error for invalid ID type', async () => {
		const response = await request(server).delete('/api/products/invalid-id');

		expect(response.statusCode).toBe(400);
		expect(response.body.errors[0].msg).toBe('ID no válido');
	});

	it('should return error for negative ID', async () => {
		const response = await request(server).delete('/api/products/-1');

		expect(response.statusCode).toBe(404);
		expect(response.body.error).toBe('Producto no encontrado');
	});

	describe('PATCH /api/products/:id', () => {
		beforeAll(async () => {
			const newProduct = createProductData(
				'Product for Availability Update',
				500,
				true,
				'unisex',
				'Product for testing availability update',
				30,
				'http://example.com/product.jpg',
				categoryId,
				subcategoryId
			);
			const response = await request(server)
				.post('/api/products')
				.send(newProduct);
			productId = response.body.data.id;
		});

		it('should toggle product availability successfully', async () => {
			const getProductResponse = await request(server).get(
				`/api/products/${productId}`
			);
			const initialAvailability = getProductResponse.body.data.availability;
			const patchResponse = await request(server).patch(
				`/api/products/${productId}`
			);

			expect(patchResponse.statusCode).toBe(200);
			expect(patchResponse.body.data.availability).toBe(!initialAvailability);

			const updatedProductResponse = await request(server).get(
				`/api/products/${productId}`
			);
			expect(updatedProductResponse.body.data.availability).toBe(
				!initialAvailability
			);
		});

		it('should return error if product does not exist', async () => {
			const patchResponse = await request(server).patch('/api/products/999999');

			expect(patchResponse.statusCode).toBe(404);
			expect(patchResponse.body.error).toBe('Producto no encontrado');
		});

		it('should return error for invalid ID', async () => {
			const patchResponse = await request(server).patch(
				'/api/products/invalid-id'
			);
			expect(patchResponse.statusCode).toBe(400);
			expect(patchResponse.body.errors[0].msg).toBe('ID no válido');
		});

		it('should return error for negative ID', async () => {
			const patchResponse = await request(server).patch('/api/products/-1');
			console.log('patchResponse.body', patchResponse.body);
			expect(patchResponse.statusCode).toBe(404);
			expect(patchResponse.body.error).toBe('Producto no encontrado');
		});
	});
});

async function createCategory(name: string) {
	const response = await request(server)
		.post('/api/products/category')
		.send({ name });
	return response.body.data.id;
}

async function createSubcategory(name: string, categoryId: number) {
	const response = await request(server)
		.post('/api/products/subcategory')
		.send({ name, categoryId });
	return response.body.data.id;
}

function createProductData(
	name: string,
	price: number,
	availability: boolean,
	gender: string,
	description: string,
	quantity: number,
	imageUrl: string,
	categoryId: number,
	subcategoryId: number
) {
	return {
		name,
		price,
		availability,
		gender,
		description,
		quantity,
		imageUrl,
		categoryId,
		subcategoryId,
	};
}
