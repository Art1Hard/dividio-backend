import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
} from "@nestjs/common";
import { StatisticService } from "src/statistic/statistic.service";

@Injectable()
export class ValidationService {
	constructor(private statisticService: StatisticService) {}

	async validateHasIncome(userId: string): Promise<void> {
		const totalIncome = await this.statisticService.getTotalIncomes(userId);
		if (totalIncome === 0) {
			throw new BadRequestException(
				"Невозможно создать распределение без дохода"
			);
		}
	}

	validateTotalPercentage(
		occupiedPercentage: number,
		newPercentage: number
	): void {
		const totalPercentage = occupiedPercentage + newPercentage;
		if (totalPercentage > 100) {
			throw new HttpException(
				{
					code: "ALLOCATION_LIMIT_EXCEEDED",
					message: "It takes too much space to add a new allocation",
					details: {
						used: occupiedPercentage,
						limit: 100,
						available: 100 - occupiedPercentage,
					},
				},
				HttpStatus.BAD_REQUEST
			);
		}
	}

	validateLastIncome = (allocationCount: number, incomeCount: number) => {
		if (allocationCount > 0 && incomeCount <= 1) {
			throw new HttpException(
				{
					code: "LAST_INCOME_VALIDATION_ERROR",
					message:
						"Cannot delete the last income source while allocations exist!",
				},
				HttpStatus.BAD_REQUEST
			);
		}
	};
}
