import { Comment } from 'src/post/entities/comment.entity';
import { DraftPost } from 'src/post/entities/draftPost.entity';
import { Inquiry } from 'src/inquiry/entities/inquiry.entity';
import { LikeComment } from 'src/post/entities/likeComment.entity';
import { LikePost } from 'src/post/entities/likePost.entity';
import { Post } from 'src/post/entities/post.entity';
import { SavedPost } from 'src/post/entities/savedPost.entity';
import {
	Check,
	Column,
	CreateDateColumn,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';
import {
	UserRank,
	UserRole,
	UserSocialProvider,
} from '../interfaces/user.interface';
import { PostReport } from 'src/report/entities/postReport.entity';
import { CommentReport } from 'src/report/entities/commentReport.entity';
import { User } from './user.entity';

@Entity()
@Unique(['subscriber', 'publisher'])
export class SubscribeInfo {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@ManyToOne(() => User, (user) => user.followings, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	subscriber: User;
	@Column()
	subscriberId: number;

	@ManyToOne(() => User, (user) => user.followers, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	publisher: User;
	@Column()
	publisherId: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column({ default: true })
	notificationEnabled: boolean;
}
