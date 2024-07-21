import request from 'supertest';
import server from '../../server';

describe('POST /api/products', () => {
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

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('data');
	});
});
