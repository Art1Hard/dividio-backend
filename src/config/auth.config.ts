import { ConfigService } from "@nestjs/config";
import { CookieOptions } from "express";

export function getCookieOptions(
	configService: ConfigService,
	expires?: Date
): CookieOptions {
	return {
		httpOnly: true,
		domain: configService.get<string>("DOMAIN"),
		expires: expires ?? new Date(0),
		secure: true,
		//! lax if production
		sameSite: "none",
	};
}
