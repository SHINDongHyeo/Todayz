import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseIntPipe,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { CreateUserReq } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(AuthGuard)
	@Get(':id')
	async findUser(@Param('id', ParseIntPipe) id: number) {
		return await this.userService.findUser(id);
	}

	@UseGuards(AuthGuard)
	@Post()
	async createUser(@Body() createUserReq: CreateUserReq) {
		const { socialId, socialProvider, email, nickname } = createUserReq;
		return await this.userService.createUser(
			socialId,
			socialProvider,
			email,
			nickname,
		);
	}

	@UseGuards(AuthGuard)
	@Delete(':id')
	async deleteUser(@Param('id', ParseIntPipe) id: number) {
		return this.userService.deleteUser(id);
	}
}
