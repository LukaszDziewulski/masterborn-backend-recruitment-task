import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

@Controller()
@ApiTags("Health")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: "Health check",
    description: "Returns API status and basic information",
  })
  getData() {
    return this.appService.getData();
  }
}
