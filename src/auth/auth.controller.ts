import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ReissueJwtReq, SignInReq, SignInRes, SignUpReq } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('sign-in')
	async signIn(@Body() signInReq: SignInReq): Promise<SignInRes> {
		const { token, provider } = signInReq;
		return this.authService.signIn(token, provider);
	}

	@Get('nickname/validate')
	async validateNickname(@Query('nickname') nickname: string) {
		return this.authService.validateNickname(nickname);
	}
}
