import {
	Column,
	CreateDateColumn,
	Entity,
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

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;
}
