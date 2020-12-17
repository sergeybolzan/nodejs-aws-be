import { HttpService, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  request(method, url, body): Promise<any> {
    const axiosConfig: AxiosRequestConfig = {
      method,
      url,
      ...(Object.keys(body || {}).length > 0 && { data: body }),
    };
    return this.httpService.request(axiosConfig).toPromise();
  }
}
