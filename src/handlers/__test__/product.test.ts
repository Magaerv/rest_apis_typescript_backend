import request from 'supertest';
import server from '../../server';

describe('POST /api/products', () => {
	it('Should display validation errors', async () => {
		const res = await request(server).post('/api/products').send({});
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(13);

		expect(res.status).not.toBe(201);
		expect(res.body.errors).not.toHaveLength(2);
	});

	it('Should validate the price is a number and greater than 0', async () => {
		const res = await request(server).post('/api/products').send({
			name: 'Producto de prueba 0',
			price: 'gfd',
			gender: 'femenino',
			description: 'Producto de prueba',
			quantity: 20,
			imageUrl: 'url.com',
			categoryId: 1,
			subcategoryId: 2,
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(2);

		expect(res.status).not.toBe(404);
		expect(res.body.errors).not.toHaveLength(3);
	});

	it('Should validate the price is greater than 0', async () => {
		const res = await request(server).post('/api/products').send({
			name: 'Producto de prueba 0',
			price: 0,
			gender: 'femenino',
			description: 'Producto de prueba',
			quantity: 20,
			imageUrl: 'url.com',
			categoryId: 1,
			subcategoryId: 2,
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(1);

		expect(res.status).not.toBe(404);
		expect(res.body.errors).not.toHaveLength(2);
	});

	it('Should create a new product', async () => {
		const res = await request(server).post('/api/products').send({
			name: 'Producto de prueba',
			price: 1000,
			gender: 'femenino',
			description: 'Producto de prueba',
			quantity: 20,
			imageUrl: 'url.com',
			categoryId: 1,
			subcategoryId: 2,
		});

		expect(res.status).toEqual(201);
		expect(res.body).toHaveProperty('data');

		expect(res.status).not.toBe(404);
		expect(res.status).not.toBe(200);
		expect(res.body).not.toHaveProperty('errors');
	});
});

describe('GET /api/products', () => {
	it('Should check if api/products url exists', async () => {
		const res = await request(server).get('/api/products');

		expect(res.status).not.toBe(404);
	});

	it('GET a JSON respone with products', async () => {
		const res = await request(server).get('/api/products');

		expect(res.status).toBe(200);
		expect(res.headers['content-type']).toMatch(/json/);
		expect(res.body).toHaveProperty('data');
		expect(res.body.data).toHaveLength(1);

		expect(res.body).not.toHaveProperty('errors');
	});
});

describe('GET api/products/:id', () => {
	it('Should return a 404 response for a non-existent product', async () => {
		const productId = 20000;
		const res = await request(server).get(`/api/products/${productId}`);

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('error');
		expect(res.body.error).toBe('Producto no encontrado');
	});

	it('Should check a valid ID in the URL', async () => {
		const res = await request(server).get('/api/products/not-valid-url');

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0].msg).toBe('ID no válido');
	});
});

describe('PUT /api/products/:id', () => {
	it('Should display validation messages when updating a product', async () => {
		const res = await request(server)
			.put('/api/products/not-valid-id')
			.send({});

		expect(res.status).toBe('400');
		expect(res.body).toHaveProperty('errors');
	});
});
