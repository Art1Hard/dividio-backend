import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserDto {
	@IsString()
	id: string;

	@IsEmail()
	email: string;

	@IsString()
	name?: string;

	@IsNotEmpty()
	@MinLength(6)
	password: string;
}
