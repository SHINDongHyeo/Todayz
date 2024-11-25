import {
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import {
	CreateUserReq,
	FindUserRes,
	UpdateUserReq,
	UserDto,
} from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserRank, UserSocialProvider } from './interfaces/user.interface';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async createUser(
		socialId: string,
		socialProvider: UserSocialProvider,
		email: string,
		nickname: string,
	) {
		try {
			const user = this.userRepository.create({
				socialId,
				socialProvider,
				email,
				nickname,
				rank: UserRank.BRONZE,
			});
			await this.userRepository.insert(user);
			return user;
		} catch (error) {
			throw error;
		}
	}

	async findUser(id: number) {
		try {
			const user = await this.userRepository.findOneBy({ id });
			if (!user) {
				throw new NotFoundException(`해당 유저가 발견되지 않습니다`);
			}
			return user;
		} catch (error) {
			throw error;
		}
	}

	async findUserBySocialIdAndProvider(
		socialId: string,
		socialProvider: UserSocialProvider,
	) {
		try {
			const user = await this.userRepository.findOneBy({
				socialId,
				socialProvider,
			});
			if (!user) {
				throw new NotFoundException(`해당 유저가 발견되지 않습니다`);
			}
			return plainToInstance(FindUserRes, user);
		} catch (error) {
			throw error;
		}
	}

	async findUserByNickname(nickname: string) {
		try {
			const user = await this.userRepository.findOneBy({
				nickname,
			});
			if (!user) {
				throw new NotFoundException(`해당 유저가 발견되지 않습니다`);
			}
			return plainToInstance(FindUserRes, user);
		} catch (error) {
			throw error;
		}
	}

	async updateUser(id: number, updateUserReq: UpdateUserReq) {
		try {
			const user = await this.userRepository.update(
				{ id },
				updateUserReq,
			);
			if (!user) {
				throw new NotFoundException(`해당 유저가 발견되지 않습니다`);
			}
			return plainToInstance(FindUserRes, user);
		} catch (error) {
			throw error;
		}
	}

	async deleteUser(id: number) {
		try {
			const user = await this.userRepository.findOne({ where: { id } });
			if (!user) {
				throw new NotFoundException(`해당 유저가 발견되지 않습니다`);
			}

			await this.userRepository.delete({ id });
		} catch (error) {
			throw error;
		}
	}
}
