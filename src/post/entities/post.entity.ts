import { PostReport } from 'src/report/entities/postReport.entity';
import { User } from 'src/user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { LikePost } from './likePost.entity';
import { PopularPost } from './popularPost.entity';
import { SavedPost } from './savedPost.entity';
import { Subcategory } from './subcategory.entity';
import { Tag } from './tag.entity';

@Entity()
@Index('post_fulltext', ['title', 'excerpt', 'content'], { fulltext: true })
export class Post {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@Column({ type: 'varchar', length: 100, collation: 'utf8mb4_general_ci' })
	title: string;

	@Column({ type: 'text', nullable: true, collation: 'utf8mb4_general_ci' })
	content: string;

	@Column({ type: 'text', nullable: true, collation: 'utf8mb4_general_ci' })
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
	@Column()
	userId: number;

	@ManyToOne(() => Category, (category) => category.posts, { eager: true })
	category: Category;
	@Column()
	categoryId: number;

	@ManyToOne(() => Subcategory, (subcategory) => subcategory.posts, {
		eager: true,
	})
	subcategory: Subcategory;
	@Column()
	subcategoryId: number;

	@ManyToMany(() => Tag, (tag) => tag.posts)
	@JoinTable()
	tags: Tag[];

	@OneToMany(() => Comment, (comment) => comment.post)
	comments: Comment[];

	@OneToMany(() => LikePost, (likePost) => likePost.post)
	likePosts: LikePost[];

	@OneToOne(() => PopularPost, (popularPost) => popularPost.post)
	popularPost: PopularPost;

	@OneToMany(() => SavedPost, (savedPost) => savedPost.post)
	savedPosts: SavedPost[];

	@OneToMany(() => PostReport, (postReport) => postReport.post)
	postReports: PostReport[];
}
