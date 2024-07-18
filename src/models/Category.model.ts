import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Size from './Size.model';

@Table({
	tableName: 'categories',
})
class Category extends Model {
	@Column({
		type: DataType.STRING(50),
		allowNull: false,
	})
	declare name: string;

	@HasMany(() => Size)
	declare sizes: Size[];
}

export default Category;
