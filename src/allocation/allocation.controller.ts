import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { AllocationService } from "./allocation.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RequestWithUser } from "src/types/request";
import { AllocationDto } from "./dto/allocation.dto";

@Controller("allocation")
export class AllocationController {
	constructor(private readonly allocationService: AllocationService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	async getAllocation(@Req() req: RequestWithUser) {
		const allocations = await this.allocationService.getMany(req.user.id);
		const freePercentage = await this.allocationService.getFreePercentage(
			req.user.id
		);
		const freeAmount = await this.allocationService.getFreeAmount(req.user.id);
		return { freePercentage, freeAmount, allocations };
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post()
	async createAllocation(
		@Body() dto: AllocationDto,
		@Req() req: RequestWithUser
	) {
		return this.allocationService.create(dto, req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Put(":id")
	async updateAllocation(
		@Param("id") id: string,
		@Body() dto: AllocationDto,
		@Req() req: RequestWithUser
	) {
		return this.allocationService.update(id, dto, req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(":id")
	async deleteAllocation(@Param("id") id: string, @Req() req: RequestWithUser) {
		return this.allocationService.remove(id, req.user.id);
	}
}
