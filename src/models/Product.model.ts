import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
	Default,
} from 'sequelize-typescript';
import Category from './Category.model';
import Subcategory from './SubCategory.model';

@Table({
	tableName: 'products',
})
class Product extends Model {
	@Column({
		type: DataType.STRING(100),
	})
	declare name: string;

	@Column({
		type: DataType.FLOAT,
	})
	declare price: number;

	@Default(true)
	@Column({
		type: DataType.BOOLEAN,
		defaultValue: true,
	})
	declare availability: boolean;

	@Column({
		type: DataType.ENUM('femenino', 'masculino', 'unisex'),
		allowNull: false,
	})
	declare gender: 'femenino' | 'masculino' | 'unisex';

	@Column({
		type: DataType.TEXT,
		allowNull: true,
	})
	declare description: string;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	declare quantity: number;

	@Column({
		type: DataType.ARRAY(DataType.STRING),
		allowNull: true,
	})
	declare imageUrls: string[];

	@ForeignKey(() => Category)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	declare categoryId: number;

	@BelongsTo(() => Category)
	declare category: Category;

	@ForeignKey(() => Subcategory)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	declare subcategoryId: number;

	@BelongsTo(() => Subcategory)
	declare subcategory: Subcategory;

	@Column({
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW,
	})
	declare createdAt: Date;

	@Column({
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW,
	})
	declare updatedAt: Date;
}

export default Product;
