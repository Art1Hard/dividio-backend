import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { AllocationDto, UpdateAllocationDto } from "./dto/allocation.dto";
import { IncomeService } from "src/income/income.service";

@Injectable()
export class AllocationService {
	constructor(
		private prisma: PrismaService,
		private incomeService: IncomeService
	) {}

	async getMany(userId: string) {
		const allocations = await this.prisma.allocation.findMany({
			where: { userId },
			select: {
				id: true,
				title: true,
				percentage: true,
			},
		});

		const totalAmount = await this.incomeService.getTotal(userId);

		return allocations.map((allocation) => ({
			...allocation,
			amount: Math.round((allocation.percentage / 100) * totalAmount),
		}));
	}

	async getUnique(id: string) {
		return await this.prisma.allocation.findUnique({
			where: { id },
		});
	}

	async create(dto: AllocationDto, userId: string) {
		const totalAmount = await this.incomeService.getTotal(userId);
		const calculatedAmount = Math.round((dto.percentage / 100) * totalAmount);

		const occupedPercentage = await this.calculateOccupiedPercentage(userId);

		// 3. Проверка: не превышает ли новая сумма 100%
		const newTotal = occupedPercentage + dto.percentage;
		if (newTotal > 100) {
			throw new BadRequestException(
				`Превышен лимит: текущая сумма ${occupedPercentage}%, добавляешь ${dto.percentage}%, получится ${newTotal}%. Лимит — 100%.`
			);
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { userId: _, ...data } = await this.prisma.allocation.create({
			data: {
				title: dto.title,
				percentage: dto.percentage,
				userId: userId,
				amount: calculatedAmount,
			},
		});

		return data;
	}

	async update(dto: UpdateAllocationDto, userId: string) {
		const existing = await this.getUnique(dto.id);

		if (!existing) throw new BadRequestException("Запись не найдена");

		if (existing.userId !== userId)
			throw new BadRequestException("Доступ запрещён!");

		const othersPercentage = await this.calculateOccupiedPercentage(userId, {
			excludeId: dto.id,
		});

		const sumTotal = othersPercentage + dto.percentage;

		if (sumTotal > 100) {
			throw new BadRequestException(
				`Превышен лимит: у других ${othersPercentage}%, ты пытаешься добавить ${dto.percentage}%, получится ${sumTotal}%. Лимит — 100%.`
			);
		}

		const totalAmount = await this.incomeService.getTotal(userId);

		const calculatedAmount = Math.round((dto.percentage / 100) * totalAmount);

		return this.prisma.allocation.update({
			where: { id: dto.id },
			data: {
				title: dto.title,
				percentage: dto.percentage,
				amount: calculatedAmount,
			},
		});
	}

	private async calculateOccupiedPercentage(
		userId: string,
		config?: { excludeId?: string }
	) {
		if (config && config.excludeId) {
			const currentAllocations = await this.prisma.allocation.aggregate({
				where: { userId, NOT: { id: config.excludeId } },
				_sum: {
					percentage: true,
				},
			});
			return currentAllocations._sum.percentage ?? 0;
		}

		const currentAllocations = await this.prisma.allocation.aggregate({
			where: { userId },
			_sum: {
				percentage: true,
			},
		});
		return currentAllocations._sum.percentage ?? 0;
	}

	async getFreePercentage(userId: string) {
		const occuped = await this.calculateOccupiedPercentage(userId);
		return 100 - occuped;
	}

	async getFreeAmount(userId: string) {
		const totalAmount = await this.incomeService.getTotal(userId);
		const freePercentage = await this.getFreePercentage(userId);
		return Math.round((freePercentage / 100) * totalAmount);
	}
}
