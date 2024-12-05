import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class testDTO {
	@Transform((value) => Number(value))
	@IsNotEmpty()
	intValue: number;

	@IsString()
	@IsNotEmpty()
	stringValue: string;
}
