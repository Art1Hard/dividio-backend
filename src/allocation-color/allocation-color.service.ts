import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
} from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { AllocationColorDto } from "./dto/allocation-color.dto";
import { AllocationService } from "src/allocation/allocation.service";

@Injectable()
export class AllocationColorService {
	constructor(
		private prisma: PrismaService,
		private allocationService: AllocationService
	) {}

	getMany(userId: string) {
		return this.prisma.allocationColor.findMany({
			where: { userId },
			select: { id: true, name: true, value: true },
		});
	}

	private async getUnique(id: string) {
		return await this.prisma.allocationColor.findUnique({
			where: { id },
		});
	}

	async create(dto: AllocationColorDto, userId: string) {
		const colorsCount = await this.prisma.allocationColor.count({
			where: { userId },
		});

		if (colorsCount >= 10)
			throw new HttpException(
				{
					code: "COLOR_MAX_COUNT",
					message: "You can't create more than 10 colors",
				},
				HttpStatus.BAD_REQUEST
			);

		return this.prisma.allocationColor.create({
			data: {
				name: dto.name,
				value: dto.value,
				userId: userId,
			},
			select: { id: true, name: true, value: true },
		});
	}

	update(id: string, dto: AllocationColorDto) {
		return this.prisma.allocationColor.update({
			where: { id },
			data: {
				name: dto.name,
				value: dto.value,
			},
			select: { id: true, name: true, value: true },
		});
	}

	async delete(id: string, userId: string) {
		const existing = await this.getUnique(id);

		const firstAllocation = await this.allocationService.findFirstByColor(
			id,
			userId
		);

		if (firstAllocation)
			throw new HttpException(
				{
					code: "COLOR_USED",
					message:
						"You can't delete this color because it is used in an allocation",
				},
				HttpStatus.BAD_REQUEST
			);

		if (!existing) throw new BadRequestException("Запись не найдена");

		if (existing.userId !== userId)
			throw new BadRequestException("Доступ запрещён!");

		const colorsCount = await this.prisma.allocationColor.count({
			where: { userId },
		});

		if (colorsCount <= 3)
			throw new HttpException(
				{
					code: "COLOR_MIN_COUNT",
					message: "You can't delete more than 3 colors",
				},
				HttpStatus.BAD_REQUEST
			);

		return this.prisma.allocationColor.delete({
			where: { id },
			select: { id: true, name: true, value: true },
		});
	}
}
