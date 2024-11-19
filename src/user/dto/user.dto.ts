import { Exclude } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsInt, IsString } from 'class-validator';
import {
	UserRank,
	UserRole,
	UserSocialProvider,
} from '../interfaces/user.interface';

export class UserDto {
	@IsInt()
	id: number;

	@IsString()
	socialId: string;

	@IsEnum(UserSocialProvider)
	socialProvider: UserSocialProvider;

	@IsEmail()
	email: string;

	@IsString()
	nickname: string;

	@IsEnum(UserRole)
	role: UserRole;

	@IsEnum(UserRank)
	rank: UserRank;

	@IsInt()
	rankPoint: number;

	@IsDate()
	createdAt: Date;
}

export class CreateUserReq {
	@IsString()
	socialId: string;

	@IsEnum(UserSocialProvider)
	socialProvider: UserSocialProvider;

	@IsEmail()
	email: string;

	@IsString()
	nickname: string;
}

export class FindUserRes {
	@IsInt()
	id: number;

	@Exclude()
	socialId: string;

	@Exclude()
	socialProvider: string;

	@Exclude()
	email: string;

	@IsString()
	nickname: string;

	@IsEnum(UserRole)
	role: UserRole;

	@IsEnum(UserRank)
	rank: UserRank;

	@IsInt()
	rankPoint: number;

	@IsDate()
	createdAt: Date;
}
