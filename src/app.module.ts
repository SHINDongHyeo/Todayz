import { Module } from '@nestjs/common';

import { AppConfigModule } from './_common/config/config.module';
import { DatabaseModule } from './_common/database/database.module';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { DebateModule } from './debate/debate.module';
import { SearchModule } from './search/search.module';
import { InquiryModule } from './inquiry/inquiry.module';

@Module({
	imports: [
		// 설정
		AppConfigModule,
		DatabaseModule,
		// 도메인
		AuthModule,
		UserModule,
		PostModule,
		DebateModule,
		SearchModule,
		InquiryModule,
	],
})
export class AppModule {}
