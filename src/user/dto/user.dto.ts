import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserDto {
	@IsEmail()
	email: string;

	@IsString()
	name?: string;

	@IsNotEmpty()
	@MinLength(6)
	password: string;
}

export class ChangeNameDto {
	@IsString()
	@MinLength(2, { message: "Name must have 2 or more symbols" })
	name: string;
}
