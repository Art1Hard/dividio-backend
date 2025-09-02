import { IsString } from "class-validator";

export class AllocationColorDto {
	@IsString()
	name: string;

	@IsString()
	value: string;
}
