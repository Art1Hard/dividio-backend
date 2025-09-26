import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AllocationColorDto {
	@IsString({ message: "Name must be a string" })
	@MinLength(1, { message: "Name cannot be empty" })
	@MaxLength(50, { message: "Name is too long" })
	name: string;

	@IsString({ message: "Value must be a string" })
	@MinLength(4, { message: "Value is too short" })
	@MaxLength(7, { message: "Value is too long" })
	@Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
		message:
			"Value must be a valid hex color starting with # (e.g. #fff or #ff00aa)",
	})
	value: string;
}
