import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthDto } from "src/auth/dto/auth.dto";
import { PrismaService } from "src/services/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: string): Promise<User | null> {
		return await this.prisma.user.findUnique({ where: { id } });
	}

	async getByEmail(email: string) {
		return await this.prisma.user.findUnique({ where: { email } });
	}

	async create(dto: AuthDto) {
		return await this.prisma.user.create({
			data: {
				email: dto.email,
				name: "",
				password: await bcrypt.hash(dto.password, 10),
			},
		});
	}

	async changeName(id: string, name: string) {
		return await this.prisma.user.update({
			where: { id },
			data: { name },
			select: { id: true, email: true, name: true },
		});
	}
}
