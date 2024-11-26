import { User } from 'src/user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { Subcategory } from './subcategory.entity';
import { Tag } from './tag.entity';

@Entity()
export class Post {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@Column({ type: 'varchar', length: 100 })
	title: string;

	@Column({ type: 'text', nullable: true })
	content: string;

	@Column({ type: 'text', nullable: true })
	excerpt: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@Column({ type: 'int', default: 0 })
	viewCount: number;

	@Column({ type: 'int', default: 0 })
	likeCount: number;

	@Column({ type: 'int', default: 0 })
	commentCount: number;

	@ManyToOne(() => User, (user) => user.posts, { eager: true })
	user: User;

	@ManyToOne(() => Category, (category) => category.posts)
	category: Category;

	@ManyToOne(() => Subcategory, (subcategory) => subcategory.posts)
	subcategory: Subcategory;

	@ManyToMany(() => Tag, (tag) => tag.posts)
	@JoinTable()
	tags: Tag[];

	@OneToMany(() => Comment, (comment) => comment.post)
	comments: Comment[];
}
