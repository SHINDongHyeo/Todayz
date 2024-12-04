import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debate } from './entities/debate.entity';

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
			const debates = this.debateRepository.find({
				relations: ['category', 'subcategory'],
			});
			return debates;
		} catch (error) {
			throw error;
		}
	}
}
