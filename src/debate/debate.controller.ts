import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	ParseIntPipe,
} from '@nestjs/common';
import { DebateService } from './debate.service';
import { CreateDebateReq } from './dto/debate.dto';

@Controller('debate')
export class DebateController {
	constructor(private readonly debateService: DebateService) {}

	@Post()
	async createDebate(@Body() createDebateReq: CreateDebateReq) {
		return this.debateService.createDebate(createDebateReq);
	}

	@Get()
	async findDebates() {
		return this.debateService.findDebates();
	}
}
