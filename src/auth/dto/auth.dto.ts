import { Type } from "class-transformer";
import { IsEmail, IsString, MinLength, ValidateNested } from "class-validator";

export class AuthDto {
	@IsEmail()
	email: string;

	@MinLength(6)
	password: string;
}

export class AuthDtoWithCaptcha {
	@ValidateNested()
	@Type(() => AuthDto)
	user: AuthDto;

	@IsString()
	captchaToken: string;
}
