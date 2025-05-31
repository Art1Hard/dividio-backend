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
		const incomes = await this.incomeService.getMany(req.user.id);
		const totalAmount = await this.incomeService.getTotal(req.user.id);

		return { totalAmount, incomes };
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post()
	async createIncome(@Req() req: RequestWithUser, @Body() dto: IncomeDto) {
		return this.incomeService.create(dto, req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Put(":id")
	async updateIncome(
		@Param("id") id: string,
		@Body() dto: IncomeDto,
		@Req() req: RequestWithUser
	) {
		return this.incomeService.update(id, dto, req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Delete(":id")
	async deleteIncome(@Param("id") id: string, @Req() req: RequestWithUser) {
		return this.incomeService.delete(id, req.user.id);
	}
}
