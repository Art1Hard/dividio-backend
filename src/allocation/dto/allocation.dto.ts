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

export class AllocationDtoIncludesId extends AllocationDto {
	@IsString()
	id: string;
}
