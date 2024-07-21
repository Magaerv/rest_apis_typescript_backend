import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Subcategory from './SubCategory.model';

@Table({
	tableName: 'categories',
})
class Category extends Model {
	@Column({
		type: DataType.STRING(50),
		allowNull: false,
	})
	declare name: string;

	@HasMany(() => Subcategory)
	declare subcategories: Subcategory[];
}

export default Category;
