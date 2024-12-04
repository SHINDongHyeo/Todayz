import {
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { JwtPayload } from 'src/auth/interfaces/auth.interface';
import { Repository } from 'typeorm';
import { FollowingRes } from './dto/subscribeInfo.dto';
import {
	CreateUserReq,
	FindUserRes,
	UpdateUserReq,
	UserDto,
} from './dto/user.dto';
import { SubscribeInfo } from './entities/subscribeInfo.entity';
import { User } from './entities/user.entity';
import { UserRank, UserSocialProvider } from './interfaces/user.interface';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(SubscribeInfo)
		private readonly subscribeInfoRepository: Repository<SubscribeInfo>,
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
			const users = await this.userRepository.findBy({ id });
			const user = users[0];
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

	async updateCommentCount(id: number, isCreating: boolean) {
		try {
			if (isCreating) {
				await this.userRepository.update(id, {
					commentCount: () => 'commentCount + 1',
				});
			} else {
				await this.userRepository.update(id, {
					commentCount: () => 'commentCount - 1',
				});
			}
			return;
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

	async subscribe(reqUser: JwtPayload, publisherUserId: number) {
		try {
			await this.userRepository.update(reqUser.id, {
				subscribeCount: () => 'subscribeCount + 1',
			});

			return await this.subscribeInfoRepository.insert({
				subscriberId: reqUser.id,
				publisherId: publisherUserId,
			});
		} catch (error) {
			throw error;
		}
	}

	async unsubscribe(reqUser: JwtPayload, publisherUserId: number) {
		try {
			await this.userRepository.update(reqUser.id, {
				subscribeCount: () => 'subscribeCount - 1',
			});

			return await this.subscribeInfoRepository.delete({
				subscriberId: reqUser.id,
				publisherId: publisherUserId,
			});
		} catch (error) {
			throw error;
		}
	}

	async isSubscribed(followerId: number, followingId: number) {
		try {
			const subscribeInfos = await this.subscribeInfoRepository.find({
				where: {
					subscriber: { id: followerId },
					publisher: { id: followingId },
				},
			});
			const subscribeInfo = subscribeInfos[0];

			return !!subscribeInfo;
		} catch (error) {
			throw error;
		}
	}

	async findFollowings(followerId: number) {
		try {
			const subscribeInfos = await this.subscribeInfoRepository.find({
				select: [
					'id',
					'createdAt',
					'notificationEnabled',
					'publisherId',
				],
				where: {
					subscriberId: followerId,
				},
			});

			return subscribeInfos;
		} catch (error) {
			throw error;
		}
	}

	async findMyFollowings(reqUser: JwtPayload, followerId: number) {
		try {
			if (reqUser.id !== followerId) {
				throw new UnauthorizedException(
					'해당 유저에 대한 구독 정보 조회 권한이 없습니다',
				);
			}

			const subscribeInfos = await this.subscribeInfoRepository.find({
				where: {
					subscriberId: followerId,
				},
				relations: ['publisher'],
			});

			// return subscribeInfos;
			return plainToInstance(FollowingRes, subscribeInfos);
		} catch (error) {
			throw error;
		}
	}
}
