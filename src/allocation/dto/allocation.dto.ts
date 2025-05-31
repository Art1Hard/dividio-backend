import { IsInt, IsNumber, IsString, Max, Min } from "class-validator";

export class AllocationDto {
	@IsString()
	title: string;

	@IsNumber()
	@Min(5)
	@Max(100)
	@IsInt()
	percentage: number;
}
