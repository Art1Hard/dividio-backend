import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
} from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { AllocationDto } from "./dto/allocation.dto";
import { IncomeService } from "src/income/income.service";
import { ValidationService } from "src/services/validation.service";
import { Allocation } from "@prisma/client";
import { calculateLocalPercentage } from "src/utils/percentage.utils";

@Injectable()
export class AllocationService {
	constructor(
		private prisma: PrismaService,
		@Inject(forwardRef(() => IncomeService))
		private incomeService: IncomeService,
		private validationService: ValidationService
	) {}

	async getMany(userId: string) {
		const allocations = await this.prisma.allocation.findMany({
			where: { userId },
			orderBy: { percentage: "asc" },
			select: {
				id: true,
				title: true,
				percentage: true,
				color: true,
			},
		});

		const totalAmount = await this.incomeService.getTotal(userId);

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

	async create(dto: AllocationDto, userId: string) {
		const occupiedPercentage =
			await this.validationService.validateOccupiedPercentage(userId);

		await this.validationService.validateHasIncome(userId);

		this.validationService.validateTotalPercentage(
			occupiedPercentage,
			dto.percentage
		);

		const totalAmount = await this.incomeService.getTotal(userId);

		const data = await this.prisma.allocation.create({
			data: {
				title: dto.title,
				percentage: dto.percentage,
				userId: userId,
				color: dto.color,
			},
			select: { id: true, title: true, percentage: true, color: true },
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
			await this.validationService.validateOccupiedPercentage(userId, id);

		this.validationService.validateTotalPercentage(
			occupiedPercentage,
			dto.percentage
		);

		const totalAmount = await this.incomeService.getTotal(userId);

		const data = await this.prisma.allocation.update({
			where: { id: id },
			data: {
				title: dto.title,
				percentage: dto.percentage,
				color: dto.color,
			},
			select: { id: true, title: true, percentage: true, color: true },
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

	async getFreePercentage(userId: string): Promise<number> {
		const occupied =
			await this.validationService.validateOccupiedPercentage(userId);
		return 100 - occupied;
	}

	async getFreeAmount(userId: string): Promise<number> {
		const totalAmount = await this.incomeService.getTotal(userId);
		const freePercentage = await this.getFreePercentage(userId);
		return Math.round((freePercentage / 100) * totalAmount);
	}
}
