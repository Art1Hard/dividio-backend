import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { IncomeDto } from "./dto/income.dto";

@Injectable()
export class IncomeService {
	constructor(private prisma: PrismaService) {}

	async getMany(userId: string) {
		return this.prisma.income.findMany({
			where: { userId },
			select: { id: true, title: true, amount: true },
		});
	}

	async create(dto: IncomeDto, userId: string) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { userId: _, ...data } = await this.prisma.income.create({
			data: {
				title: dto.title,
				amount: dto.amount,
				userId: userId,
			},
		});

		return data;
	}

	async getTotal(userId: string) {
		const result = await this.prisma.income.aggregate({
			where: { userId },
			_sum: {
				amount: true,
			},
		});

		return result._sum.amount ?? 0;
	}
}
