import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import { Repository } from 'typeorm';
import { Debate } from './entities/debate.entity';
import { TooManyDiscussorException } from './exceptions/TooManyDiscussor.exception';

@Injectable()
export class DebateService {
	constructor(
		@InjectRepository(Debate)
		private readonly debateRepository: Repository<Debate>,
	) {}

	async createDebate() {
		throw new Error('Method not implemented.');
	}

	async findDebates() {
		try {
			const debates = await this.debateRepository.find({
				relations: ['category', 'subcategory'],
			});
			return debates;
		} catch (error) {
			throw error;
		}
	}

	async updateDiscussantCount(debateId: number, discussantCount: number) {
		try {
			const debates = await this.debateRepository.findBy({
				id: debateId,
			});
			const debate = debates[0];

			if (debate.maxDiscussantCount < discussantCount) {
				console.log('에러던지기');
				throw new TooManyDiscussorException();
			}
			await this.debateRepository.update(
				{ id: debateId },
				{ discussantCount: discussantCount },
			);
		} catch (error) {
			throw error;
		}
	}
}
