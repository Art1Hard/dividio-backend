import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { AllocationColorDto } from "./dto/allocation-color.dto";

@Injectable()
export class AllocationColorService {
	constructor(private prisma: PrismaService) {}

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

	create(dto: AllocationColorDto, userId: string) {
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

		if (!existing) throw new BadRequestException("Запись не найдена");

		if (existing.userId !== userId)
			throw new BadRequestException("Доступ запрещён!");

		return this.prisma.allocationColor.delete({
			where: { id },
			select: { id: true, name: true, value: true },
		});
	}
}
