import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject, Subscription } from 'rxjs';
import { News } from './news.model';

@Injectable({ providedIn: 'root' })
export class NewsMainService {
  subscription: Subscription;
  private news: News[] = [];
  newsChanged = new Subject<News[]>();
  errorOccurred = new Subject<string>();

  constructor(private http: HttpClient) {}

  /**
   * fetchNewsData()
   * This function fetches News JSON data from backend using Angular HTTPClient.It calls setNewsData method.
   * @returns newsarray or error based on response.
   */
  fetchNewsData() {
    return this.http
      .get<News[]>(
        'https://ng-news-app-new-default-rtdb.firebaseio.com/news.json'
      )
      .pipe(
        map((newsArr) => {
          return newsArr;
        })
      )
      .subscribe(
        (newsArr) => {
          this.setNewsData(newsArr);
        },
        (error) => {
          if (error.message) this.errorOccurred.next(error.message);
          else
            this.errorOccurred.next(
              'Unknown error occurred, please try after some time'
            );
        }
      );
  }

  /**
   * setNewsData(): This method set the news array and puclish the event. thats news array is changed.
   * @param newsArr
   */
  setNewsData(newsArr: News[]) {
    this.news = newsArr;
    this.newsChanged.next(this.news.slice());
  }
}
