import { BadRequestException, Injectable } from "@nestjs/common";
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

		return this.prisma.income.delete({
			where: { id },
			select: { id: true, title: true, amount: true },
		});
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
