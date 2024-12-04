import { Module } from '@nestjs/common';
import { DebateService } from './debate.service';
import { DebateController } from './debate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debate } from './entities/debate.entity';
import { AccessTokenJwtModule } from 'src/_common/jwt/access_token_jwt.module';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Debate]),
		AccessTokenJwtModule,
		UserModule,
	],
	controllers: [DebateController],
	providers: [DebateService],
})
export class DebateModule {}