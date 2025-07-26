import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private userService: UserService,
		private configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey:
				configService.get<string>("JWT_SECRET") || "default_jwt_secret",
		});
	}

	async validate({ id }: { id: string }) {
		const user = await this.userService.getById(id);

		if (!user) throw new UnauthorizedException("User not found");

		return {
			id: user.id,
			email: user.email,
			name: user.name,
		};
	}
}
