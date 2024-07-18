import request from 'supertest';
import server from '../../server';

describe('POST /api/products', () => {
	it('Should create a new product', async () => {
		const res = await request(server)
			.post('/api/products')
			.send({ name: 'Mouse - testing', price: 50 });

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('data');
	});
});
