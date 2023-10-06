import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import * as dotenv from 'dotenv'; // Import dotenv

dotenv.config();

@Injectable()
export class NewsService {
  constructor(private readonly httpService: HttpService) {}
  getNews(query): Observable<any> {
    const string = this.getCallString(query);
    return this.httpService
      .get(
        `https://newsapi.org/v2/everything?${string}&apiKey=${process.env.NEWS_API}`,
      )
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
