import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "src/services/prisma.service";

@Module({
	controllers: [UserController],
	providers: [PrismaService, UserService],
	exports: [UserService],
})
export class UserModule {}
