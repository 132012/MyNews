import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(public serv: NewsService) {}
  @Get()
  getNews(@Query('q') search: any): Observable<any> {
    const query = { q: search };
    return this.serv.getNews(query);
  }
}