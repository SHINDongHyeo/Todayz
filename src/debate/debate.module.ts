import { Module } from '@nestjs/common';
import { DebateService } from './debate.service';
import { DebateController } from './debate.controller';

@Module({
  controllers: [DebateController],
  providers: [DebateService],
})
export class DebateModule {}
