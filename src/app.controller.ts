import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async checkHealth() {
    try {
      // Test database connection
      const isConnected = this.dataSource.isInitialized;
      const dbStatus = isConnected ? 'connected' : 'disconnected';
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: {
          status: dbStatus,
          type: this.dataSource.options.type,
          database: this.dataSource.options.database,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
