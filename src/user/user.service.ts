import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthDto } from "src/auth/dto/auth.dto";
import { PrismaService } from "src/services/prisma.service";
import * as bcrypt from "bcrypt";
import { UserDto } from "./dto/user.dto";
import { COLORS } from "src/constants/color.constants";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: string): Promise<User | null> {
		// await new Promise((res) => setTimeout(res, 1000));
		return await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				password: true,
				colors: {
					select: {
						id: true,
						name: true,
						value: true,
					},
				},
			},
		});
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
				colors: {
					create: COLORS,
				},
			},
		});
	}

	async update(id: string, dto: UserDto) {
		const userGetByEmail = await this.getByEmail(dto.email);
		const userGetById = await this.getById(id);

		if (userGetByEmail && userGetByEmail.email !== userGetById?.email)
			throw new BadRequestException("This email is already taken");

		let user = dto;
		if (dto.password)
			user = { ...user, password: await bcrypt.hash(dto.password, 10) };

		return await this.prisma.user.update({
			where: { id },
			data: user,
			select: { id: true, email: true, name: true },
		});
	}
}
