import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { IncomeService } from "./income.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RequestWithUser } from "src/types/request";
import { IncomeDto } from "./dto/income.dto";

@Controller("income")
export class IncomeController {
	constructor(private readonly incomeService: IncomeService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	async getIncomes(@Req() req: RequestWithUser) {
		return this.incomeService.getMany(req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post()
	async createIncome(@Req() req: RequestWithUser, @Body() dto: IncomeDto) {
		return this.incomeService.create(dto, req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Get("total")
	async getTotalIncomes(@Req() req: RequestWithUser) {
		const total = await this.incomeService.getTotal(req.user.id);
		return { totalAmount: total };
	}
}
