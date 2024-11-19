import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private configService: ConfigService) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();

		const authHeader = request.headers.authorization;
		if (!authHeader) {
			throw new UnauthorizedException('인증 헤더가 없습니다');
		}

		const accessToken = authHeader.split(' ')[1];
		if (!accessToken) {
			throw new UnauthorizedException('Bearer token이 없습니다');
		}

		try {
			const decoded = jwt.verify(
				accessToken,
				this.configService.get<string>('ACCESS_TOKEN_JWT_SECRET'),
			);
			request.user = decoded;
			return true;
		} catch (error) {
			throw new UnauthorizedException('Bearer token이 유효하지 않습니다');
		}
	}
}
