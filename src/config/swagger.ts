import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
	swaggerDefinition: {
		openapi: '3.0.0',
		tags: [
			{
				name: 'Products',
				description: 'API operations related to products',
			},
			{
				name: 'Categories',
				description: "API operations related to product's category",
			},
			{
				name: 'SubCategories',
				description: "API operations related to product's subcategory",
			},
		],
		info: {
			title: 'REST API Node.js / Express / Typescript',
			version: '1.0.0',
			description: 'API Docs for Products',
		},
	},
	apis: ['./src/router.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUiOptions: SwaggerUiOptions = {
	customCss: `
    .topbar-wrapper .link {
      content: url('https://firebasestorage.googleapis.com/v0/b/outlet-genios.appspot.com/o/Logo_Marca_Personal_Minimalista_Elegante_y_Org%C3%A1nico_Blanco_y_Negro-removebg-preview.png?alt=media&token=b8fb4cfd-72c2-4abf-9a18-e9334c8a9439');
      height: 210px;
      width: 1800px;
    }
    .swagger-ui .topbar {
      background: linear-gradient(to bottom, black, gray);
    }
  `,
	customSiteTitle: 'Documentación REST API Express / TypeScript',
};

export default swaggerSpec;
export { swaggerUiOptions };
