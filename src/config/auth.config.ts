import { ConfigService } from "@nestjs/config";
import { CookieOptions } from "express";

export function getCookieOptions(
	configService: ConfigService,
	expires?: Date
): CookieOptions {
	return {
		httpOnly: true,
		expires: expires ?? new Date(0),
		secure: true,
		sameSite: "none",
	};
}
