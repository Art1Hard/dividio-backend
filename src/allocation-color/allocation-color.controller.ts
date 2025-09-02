import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { AllocationColorService } from "./allocation-color.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RequestWithUser } from "src/types/request";
import { AllocationColorDto } from "./dto/allocation-color.dto";

@Controller("allocation-color")
export class AllocationColorController {
	constructor(
		private readonly allocationColorService: AllocationColorService
	) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	getColor(@Req() req: RequestWithUser) {
		return this.allocationColorService.getMany(req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post()
	async createColor(
		@Body() dto: AllocationColorDto,
		@Req() req: RequestWithUser
	) {
		return this.allocationColorService.create(dto, req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(":id")
	async deleteColor(@Param("id") id: string, @Req() req: RequestWithUser) {
		return this.allocationColorService.delete(id, req.user.id);
	}
}
