import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript';
import Category from './Category.model';

@Table({
	tableName: 'subcategories',
})
class Subcategory extends Model {
	@Column({
		type: DataType.STRING(50),
		allowNull: false,
	})
	declare name: string;

	@ForeignKey(() => Category)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	declare categoryId: number;

	@BelongsTo(() => Category)
	declare category: Category;
}

export default Subcategory;
