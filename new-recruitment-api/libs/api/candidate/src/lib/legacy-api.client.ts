import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class LegacyApiClient {
  private readonly logger = new Logger(LegacyApiClient.name);
  private readonly legacyApiUrl: string;
  private readonly legacyApiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.legacyApiUrl = this.configService.get<string>("LEGACY_API_URL") || "http://localhost:4040";
    this.legacyApiKey =
      this.configService.get<string>("LEGACY_API_KEY") || "0194ec39-4437-7c7f-b720-7cd7b2c8d7f4";

    this.logger.log(`Legacy API URL configured: ${this.legacyApiUrl}`);
  }

  async sendCandidate(candidateData: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      this.logger.log(`Sending candidate to legacy API: ${candidateData.email}`);

      const response = await firstValueFrom(
        this.httpService.post(`${this.legacyApiUrl}/candidates`, candidateData, {
          headers: {
            "x-api-key": this.legacyApiKey,
            "Content-Type": "application/json",
          },
          timeout: 5000,
        })
      );

      this.logger.log(`Legacy API success for ${candidateData.email}: ${response.status}`);

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: any) {
      this.logger.error(`Legacy API error for ${candidateData.email}: ${error.message}`);

      if (error.response) {
        return {
          success: false,
          error: error.response.data.message || "Legacy API error",
        };
      }

      return {
        success: false,
        error: error.message || "Unknown error",
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.legacyApiUrl}/`, {
          timeout: 3000,
        })
      );
      return response.status === 200;
    } catch (error) {
      this.logger.warn("Legacy API health check failed - API may be unavailable");
      return false;
    }
  }
}
