import {
	Column,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Post } from './post.entity';

@Entity()
export class Subcategory {
	@PrimaryColumn({ type: 'int' })
	id: number;

	@Column({ type: 'varchar', length: 50 })
	name: string;

	@ManyToOne(() => Category, (category) => category.subcategories)
	category: Category;

	@OneToMany(() => Post, (post) => post.subcategory)
	posts: Post[];
}
