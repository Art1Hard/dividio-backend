import { IsString, Min } from "class-validator";

export class IncomeDto {
	@IsString()
	title: string;

	@Min(1000)
	amount: number;
}
