import {
	Body,
	Controller,
	Post,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	@UsePipes(new ValidationPipe())
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto);
	}

	@Post("login")
	@UsePipes(new ValidationPipe())
	async login(@Body() dto: AuthDto) {
		return this.authService.login(dto);
	}
}
