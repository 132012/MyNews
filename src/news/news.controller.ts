import { Controller, Get, Query } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(public serv: NewsService) {}
  @Get()
  getNews(@Query() query: any): Observable<any> {
    const yo = {q:'esports'};
    return this.serv.getNews(yo);
  }
}
