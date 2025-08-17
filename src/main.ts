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
		origin: [
			"http://localhost:5173",
			"http://192.168.0.14:5173",
			"http://172.19.0.1:5173",
			"http://localhost:3000",
		], // или массив origins
		credentials: true, // разрешаем передачу кук
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});

	await app.listen(configService.get<number>("PORT") || 3000);
}

void bootstrap();
