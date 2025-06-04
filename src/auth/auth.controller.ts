import {
	Body,
	Controller,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { Request, Response } from "express";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	@UsePipes(new ValidationPipe())
	async register(
		@Body() dto: AuthDto,
		@Res({ passthrough: true }) res: Response
	) {
		const { refreshToken, ...response } = await this.authService.register(dto);
		this.authService.addRefreshTokenToResponse(res, refreshToken);

		return response;
	}

	@Post("login")
	@UsePipes(new ValidationPipe())
	async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
		const { refreshToken, ...response } = await this.authService.login(dto);
		this.authService.addRefreshTokenToResponse(res, refreshToken);

		return response;
	}

	@Post("login/access-token")
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const cookies = req.cookies as Record<string, string>;
		const refreshTokenFromCookies =
			cookies[this.authService.REFRESH_TOKEN_NAME];

		if (!refreshTokenFromCookies) {
			this.authService.removeRefreshTokenFromResponse(res);
			throw new UnauthorizedException("Refresh token not passed");
		}

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFromCookies
		);

		this.authService.addRefreshTokenToResponse(res, refreshToken);

		return response;
	}

	@Post("logout")
	logout(@Res({ passthrough: true }) res: Response) {
		this.authService.removeRefreshTokenFromResponse(res);

		return true;
	}
}
