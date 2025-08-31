import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { IncomeDto } from "./dto/income.dto";
import { AllocationService } from "src/allocation/allocation.service";

@Injectable()
export class IncomeService {
	constructor(
		private prisma: PrismaService,
		private allocationService: AllocationService
	) {}

	async getMany(userId: string) {
		return this.prisma.income.findMany({
			where: { userId },
			orderBy: { amount: "desc" },
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

	async update(id: string, dto: IncomeDto, userId: string) {
		const existing = await this.prisma.income.findUnique({ where: { id } });

		if (!existing) throw new BadRequestException("Запись не найдена");

		if (existing.userId !== userId)
			throw new BadRequestException("Доступ запрещён!");

		return this.prisma.income.update({
			where: { id },
			data: dto,
			select: { id: true, title: true, amount: true },
		});
	}

	async delete(id: string, userId: string) {
		const existing = await this.prisma.income.findUnique({ where: { id } });

		if (!existing) throw new BadRequestException("Запись не найдена");

		if (existing.userId !== userId)
			throw new BadRequestException("Доступ запрещён!");

		const allocationCount = await this.allocationService.getCount(userId);
		const incomeCount = await this.getCount(userId);

		if (allocationCount > 0 && incomeCount <= 1) {
			throw new BadRequestException(
				"Невозможно удалить последний источник дохода, пока есть распределения!"
			);
		}

		return this.prisma.income.delete({
			where: { id },
			select: { id: true, title: true, amount: true },
		});
	}

	async getCount(userId: string) {
		return this.prisma.income.count({ where: { userId } });
	}
}
