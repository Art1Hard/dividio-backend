import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Put,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RequestWithUser } from "src/types/request";
import { UserDto } from "./dto/user.dto";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	async get(@Req() req: RequestWithUser) {
		const data = await this.userService.getById(req.user.id);

		if (!data) throw new BadRequestException("Error with get user");

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = data;

		return user;
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Put()
	async update(@Body() dto: UserDto, @Req() req: RequestWithUser) {
		return this.userService.update(req.user.id, dto);
	}
}
