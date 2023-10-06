import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class NewsService {
  url = '11ad615beb9045e68d58efdeb6546ae8';
  constructor(private readonly httpService: HttpService) {}
  getNews(query): Observable<any> {
    const string = this.getCallString(query);
    return this.httpService
      .get(`https://newsapi.org/v2/everything?${string}&apiKey=${this.url}`)
      .pipe(map((response) => response.data));
  }

  getCallString(query): string {
    let string = '';
    if (!Object.keys(query).length) {
      return string;
    }
    for (const property in query) {
      string += `&${property}=${query[property]}`;
    }
    return string.substring(1);
  }
}
