import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { AuthDto } from "./dto/auth.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
	) {}

	async register(dto: AuthDto) {
		const existingUser = await this.userService.getByEmail(dto.email);

		if (existingUser)
			throw new BadRequestException("User with this email is already exist");

		const hashedPassword = await bcrypt.hash(dto.password, 10);

		const user = await this.userService.create(dto.email, hashedPassword);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, name, ...result } = user;
		return result;
	}

	async login(dto: AuthDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto);
		return {
			...user,
			accessToken: this.issueToken(user.id),
		};
	}

	private async validateUser({ email, password }: AuthDto) {
		const user = await this.userService.getByEmail(email);

		if (!user) throw new UnauthorizedException("User not found");

		const passwordMatches = await bcrypt.compare(password, user.password);
		if (!passwordMatches) throw new UnauthorizedException("Invalid password");

		return user;
	}

	private issueToken(id: string) {
		const payload = { id };

		return this.jwtService.sign(payload, { expiresIn: "1h" });
	}
}
