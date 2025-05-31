import { IsNumber, IsString, Min } from "class-validator";

export class AllocationDto {
	@IsString()
	title: string;

	@IsNumber()
	@Min(5)
	percentage: number;
}

export class UpdateAllocationDto extends AllocationDto {
	@IsString()
	id: string;
}
