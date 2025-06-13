import { PrismaService } from "src/prisma.service";

export const calculateOccupiedPercentage = async (
	prisma: PrismaService,
	userId: string,
	excludeId?: string
): Promise<number> => {
	const where = excludeId ? { userId, NOT: { id: excludeId } } : { userId };

	const { _sum } = await prisma.allocation.aggregate({
		where,
		_sum: {
			percentage: true,
		},
	});
	return _sum.percentage ?? 0;
};
