import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getData(): { message: string; version: string; status: string } {
    return {
      message: "Welcome to Recruitment API!",
      version: "1.0.0",
      status: "running",
    };
  }
}
