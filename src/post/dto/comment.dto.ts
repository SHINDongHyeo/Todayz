import { Type } from 'class-transformer';
import {
	IsDate,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateCommentReq {
	@IsInt()
	@IsOptional()
	parentId: number;

	@IsString()
	@IsNotEmpty()
	content: string;

	@IsInt()
	@IsNotEmpty()
	postId: number;
}

export class FindCommentsReq {
	@IsInt()
	@IsNotEmpty()
	@Type(() => Number)
	postId: number;
}

export class FindCommentsRes {
	@IsInt()
	@IsOptional()
	parentId: number;

	@IsString()
	@IsNotEmpty()
	content: string;

	@IsDate()
	@IsNotEmpty()
	createdAt: Date;
}
