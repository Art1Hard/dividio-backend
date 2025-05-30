import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: string): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { id } });
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({ where: { email } });
	}

	async create(email: string, password: string) {
		return await this.prisma.user.create({
			data: { email, password },
		});
	}
}
