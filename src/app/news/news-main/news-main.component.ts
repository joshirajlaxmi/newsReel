import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NewsMainService } from '../news-main.service';
import { News } from '../news.model';

@Component({
  selector: 'app-news-main',
  templateUrl: './news-main.component.html',
  styleUrls: ['./news-main.component.css'],
  providers: [NgbCarouselConfig],
})
export class NewsMainComponent implements OnInit, OnDestroy {
  images = [700, 533, 807, 124].map(
    (n) => `https://picsum.photos/id/${n}/900/500`
  );
  newsArr: News[] = [];
  error = null;
  isFetching = false;

  subscription: Subscription;
  errorSub: Subscription;

  constructor(config: NgbCarouselConfig, private newsService: NewsMainService) {
    // customize default values of carousels used by this component tree
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
  }

  ngOnInit(): void {
    //Fetch recipe data from service
    this.isFetching = true;
    this.newsService.fetchNewsData();
    //subscribe to news change event
    this.subscription = this.newsService.newsChanged.subscribe(
      (newsArr: News[]) => {
        this.isFetching = false;
        this.newsArr = newsArr;
      }
    );

    this.errorSub = this.newsService.errorOccurred.subscribe((errorMessage) => {
      this.isFetching = false;
      this.error = errorMessage;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.errorSub.unsubscribe();
  }
}
