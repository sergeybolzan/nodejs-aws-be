import {
  All,
  BadGatewayException,
  CacheInterceptor,
  Controller,
  InternalServerErrorException,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { Method } from 'axios';
import { ConfigService } from '@nestjs/config';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @All()
  async handleAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const recipient = req.originalUrl.split('/')[1];
    const recipientUrl = this.configService.get<string>(recipient);
    if (recipientUrl) {
      try {
        const response = await this.appService.request(
          req.method as Method,
          recipientUrl + req.originalUrl,
          req.body,
        );
        return response.data;
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          res.status(status).json(data);
        } else {
          throw new InternalServerErrorException({ error: error.message });
        }
      }
    } else {
      throw new BadGatewayException({ error: 'Cannot process request' });
    }
  }
}
