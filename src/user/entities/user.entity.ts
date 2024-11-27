import { Comment } from 'src/post/entities/comment.entity';
import { DraftPost } from 'src/post/entities/draftPost.entity';
import { LikeComment } from 'src/post/entities/likeComment.entity';
import { Post } from 'src/post/entities/post.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';
import {
	UserRank,
	UserRole,
	UserSocialProvider,
} from '../interfaces/user.interface';

@Entity()
export class User {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@Column({ type: 'varchar', length: 100 })
	socialId: string;

	@Column({ type: 'enum', enum: UserSocialProvider })
	socialProvider: UserSocialProvider;

	@Column({ type: 'varchar', length: 100 })
	email: string;

	@Column({ type: 'varchar', length: 50, unique: true })
	nickname: string;

	@Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
	role: UserRole;

	@Column({ type: 'enum', enum: UserRank, nullable: true })
	rank: UserRank;

	@Column({ type: 'smallint', default: 0 })
	rankPoint: number;

	@Column({ type: 'varchar', length: 200, nullable: true })
	profileImageUrl: string;

	@Column({ type: 'tinytext', nullable: true })
	introduction: string;

	@Column({ type: 'smallint', default: 0 })
	subscriberCount: number;

	@Column({ type: 'smallint', default: 0 })
	subscribeCount: number;

	@Column({ type: 'smallint', default: 0 })
	postCount: number;

	@Column({ type: 'smallint', default: 0 })
	commentCount: number;

	@Column({ type: 'smallint', default: 0 })
	debateCount: number;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@OneToMany(() => Post, (post) => post.user)
	posts: Post[];

	@OneToMany(() => DraftPost, (drafPost) => drafPost.user)
	draftPosts: DraftPost[];

	@OneToMany(() => Comment, (comment) => comment.user)
	comments: Comment[];

	@OneToMany(() => Comment, (comment) => comment.mentionUser)
	mentionedComments: Comment[];

	@OneToMany(() => LikeComment, (likeComment) => likeComment.user)
	likeComments: LikeComment[];
}
