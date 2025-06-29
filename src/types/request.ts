import { Request } from "express";

export interface RequestWithUser extends Request {
	user: {
		id: string;
		email: string;
		name: string | null;
	};
}

export interface TurnstileResponse {
	success: boolean;
	challenge_ts: string; // timestamp of challenge
	hostname: string;
	"error-codes"?: string[];
}
