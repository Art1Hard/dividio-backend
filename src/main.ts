import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);

	app.use(cookieParser());

	app.setGlobalPrefix("api");

	app.enableCors({
		origin: "http://localhost:5173", // или массив origins
		credentials: true, // разрешаем передачу кук
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});

	await app.listen(configService.get<number>("PORT") || 3000);
}

void bootstrap();
