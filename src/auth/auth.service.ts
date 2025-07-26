import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { AuthDto, AuthDtoWithCaptcha } from "./dto/auth.dto";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { getCookieOptions } from "src/config/auth.config";
import axios from "axios";
import { TurnstileResponse } from "src/types/request";

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 7;
	REFRESH_TOKEN_NAME = "refreshToken";

	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async register(dto: AuthDtoWithCaptcha) {
		const existingUser = await this.userService.getByEmail(dto.user.email);
		if (existingUser)
			throw new BadRequestException("User with this email is already exist");

		const isHuman = await this.verifyTurnstileToken(dto.captchaToken);
		if (!isHuman) throw new UnauthorizedException("Вы не прошли рекапчу...");

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.create(dto.user);
		const tokens = this.issueTokens(user.id);

		return {
			user,
			...tokens,
		};
	}

	async login(dto: AuthDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto);
		const tokens = this.issueTokens(user.id);

		return {
			user,
			...tokens,
		};
	}

	private async validateUser({ email, password }: AuthDto) {
		const user = await this.userService.getByEmail(email);

		if (!user) throw new UnauthorizedException("User not found");

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) throw new UnauthorizedException("Invalid password");

		return user;
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwtService.verifyAsync<{ id: string }>(
			refreshToken
		);

		if (!result) throw new UnauthorizedException("Invalid refresh token");

		const user = await this.userService.getById(result.id);

		if (!user) throw new BadRequestException("User not found");

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...resultUser } = user;

		const tokens = this.issueTokens(user.id);

		return {
			user: resultUser,
			...tokens,
		};
	}

	private issueTokens(userId: string) {
		const payload = { id: userId };

		const accessToken = this.jwtService.sign(payload, { expiresIn: "1h" });

		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: "7d",
		});

		return { accessToken, refreshToken };
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date();
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

		res.cookie(
			this.REFRESH_TOKEN_NAME,
			refreshToken,
			getCookieOptions(this.configService, expiresIn)
		);
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(
			this.REFRESH_TOKEN_NAME,
			"",
			getCookieOptions(this.configService)
		);
	}

	async verifyTurnstileToken(token: string, remoteip?: string) {
		try {
			const res = await axios.post<TurnstileResponse>(
				"https://challenges.cloudflare.com/turnstile/v0/siteverify",
				new URLSearchParams({
					secret:
						this.configService.get<string>("TURNSTILE_SECRET") || "secretKey",
					response: token,
					...(remoteip ? { remoteip } : {}),
				}),
				{
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
				}
			);

			return res.data.success;
		} catch (e: unknown) {
			console.error("Something was wrong with verify Turnstile token! ", e);
			throw new UnauthorizedException(
				"Something was wrong... Please, try later"
			);
		}
	}
}
