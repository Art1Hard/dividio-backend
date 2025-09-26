import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { AllocationDto } from "./dto/allocation.dto";
import { ValidationService } from "src/services/validation.service";
import { Allocation } from "@prisma/client";
import { calculateLocalPercentage } from "src/utils/percentage.utils";
import { StatisticService } from "src/statistic/statistic.service";

@Injectable()
export class AllocationService {
	constructor(
		private prisma: PrismaService,
		private validationService: ValidationService,
		private statisticService: StatisticService
	) {}

	async getMany(userId: string) {
		const allocations = await this.prisma.allocation.findMany({
			where: { userId },
			orderBy: { percentage: "asc" },
			select: {
				id: true,
				title: true,
				percentage: true,
				color: {
					select: {
						id: true,
						name: true,
						value: true,
					},
				},
			},
		});

		const totalAmount =
			await this.statisticService.getTotalIncomesAmount(userId);

		return allocations.map((allocation) => ({
			...allocation,
			amount: calculateLocalPercentage(allocation.percentage, totalAmount),
		}));
	}

	private async getUnique(id: string): Promise<Allocation | null> {
		return await this.prisma.allocation.findUnique({
			where: { id },
		});
	}

	async findFirstByColor(colorId: string, userId: string) {
		return await this.prisma.allocation.findFirst({
			where: { userId, colorId },
		});
	}

	async create(dto: AllocationDto, userId: string) {
		const occupiedPercentage =
			await this.statisticService.getOccupiedPercentage(userId);

		await this.validationService.validateHasIncome(userId);

		this.validationService.validateTotalPercentage(
			occupiedPercentage,
			dto.percentage
		);

		const totalAmount =
			await this.statisticService.getTotalIncomesAmount(userId);

		const data = await this.prisma.allocation.create({
			data: {
				title: dto.title,
				percentage: dto.percentage,
				userId: userId,
				colorId: dto.colorId,
			},
			select: {
				id: true,
				title: true,
				percentage: true,
				color: {
					select: {
						id: true,
						name: true,
						value: true,
					},
				},
			},
		});

		return {
			...data,
			amount: calculateLocalPercentage(dto.percentage, totalAmount),
		};
	}

	async update(id: string, dto: AllocationDto, userId: string) {
		const existing = await this.getUnique(id);

		if (!existing) throw new BadRequestException("Запись не найдена");

		if (existing.userId !== userId)
			throw new BadRequestException("Доступ запрещён!");

		const occupiedPercentage =
			(await this.statisticService.getOccupiedPercentage(userId)) -
			existing.percentage;

		this.validationService.validateTotalPercentage(
			occupiedPercentage,
			dto.percentage
		);

		const totalAmount =
			await this.statisticService.getTotalIncomesAmount(userId);

		const data = await this.prisma.allocation.update({
			where: { id: id },
			data: {
				title: dto.title,
				percentage: dto.percentage,
				colorId: dto.colorId,
			},
			select: {
				id: true,
				title: true,
				percentage: true,
				color: {
					select: {
						id: true,
						name: true,
						value: true,
					},
				},
			},
		});

		return {
			...data,
			amount: calculateLocalPercentage(dto.percentage, totalAmount),
		};
	}

	async remove(id: string, userId: string) {
		const existing = await this.getUnique(id);

		if (!existing) throw new BadRequestException("Запись не найдена");

		if (existing.userId !== userId)
			throw new BadRequestException("Доступ запрещён!");

		return await this.prisma.allocation.delete({
			where: { id },
			select: { id: true, title: true, percentage: true },
		});
	}

	async getCount(userId: string) {
		return this.prisma.allocation.count({ where: { userId } });
	}
}
