import { User } from 'src/user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Comment {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@Column({ type: 'int', nullable: true })
	parentId: number;

	@Column({ type: 'text' })
	content: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@ManyToOne(() => Post, (post) => post.comments, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	post: Post;

	@ManyToOne(() => User, (user) => user.comments, {
		nullable: true,
		onDelete: 'SET NULL', // 사용자가 악의적 댓글 작성 후 탈퇴해 발뺌하는 경우 방지
		onUpdate: 'CASCADE',
	})
	user: User;
}
