import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class StatisticService {
	constructor(private prisma: PrismaService) {}

	async getTotalIncomes(userId: string) {
		const result = await this.prisma.income.count({ where: { userId } });
		return result;
	}

	async getTotalIncomesAmount(userId: string) {
		const result = await this.prisma.income.aggregate({
			where: { userId },
			_sum: {
				amount: true,
			},
		});

		return result._sum.amount ?? 0;
	}

	async getFreePercentage(userId: string): Promise<number> {
		const result = await this.prisma.allocation.aggregate({
			where: { userId },
			_sum: {
				percentage: true,
			},
		});
		const occupied = result._sum.percentage ?? 0;

		return 100 - occupied;
	}

	async getOccupiedPercentage(userId: string): Promise<number> {
		const freePercentage = await this.getFreePercentage(userId);
		return 100 - freePercentage;
	}
}
