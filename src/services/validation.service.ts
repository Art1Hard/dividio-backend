import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { IncomeService } from "src/income/income.service";

@Injectable()
export class ValidationService {
	constructor(
		private prisma: PrismaService,
		private incomeService: IncomeService
	) {}

	async validateHasIncome(userId: string): Promise<void> {
		const totalIncome = await this.incomeService.getTotal(userId);
		if (totalIncome === 0) {
			throw new BadRequestException(
				"Невозможно создать распределение без дохода"
			);
		}
	}

	async validateOccupiedPercentage(
		userId: string,
		excludeId?: string
	): Promise<number> {
		const where = excludeId ? { userId, NOT: { id: excludeId } } : { userId };

		const { _sum } = await this.prisma.allocation.aggregate({
			where,
			_sum: {
				percentage: true,
			},
		});
		return _sum.percentage ?? 0;
	}

	validateTotalPercentage(
		occupiedPercentage: number,
		newPercentage: number
	): void {
		const totalPercentage = occupiedPercentage + newPercentage;
		if (totalPercentage > 100) {
			throw new BadRequestException(
				"Суммарный процент распределения не может превышать 100%"
			);
		}
	}
}
