import { BadRequestException } from "@nestjs/common";

export const calculateLocalPercentage = (
	percentage: number,
	totalAmount: number
): number => Math.round((percentage / 100) * totalAmount);

export const getSumPercentage = (occupied: number, newValue: number): number =>
	occupied + newValue;

export const isOverflowPercentage = (sumPercentage: number): boolean =>
	sumPercentage > 100;

export const throwOverflowException = (total: number): void => {
	throw new BadRequestException(`Превышен лимит: ${total}%. Лимит — 100%.`);
};
