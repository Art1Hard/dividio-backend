import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { AuthDto } from "./dto/auth.dto";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { getCookieOptions } from "src/config/auth.config";

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 7;
	REFRESH_TOKEN_NAME = "refreshToken";

	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async register(dto: AuthDto) {
		const existingUser = await this.userService.getByEmail(dto.email);

		if (existingUser)
			throw new BadRequestException("User with this email is already exist");

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.create(dto);
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
}
