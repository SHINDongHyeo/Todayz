import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { DebateService } from './debate.service';

@Controller('debate')
export class DebateController {
	constructor(private readonly debateService: DebateService) {}
}
