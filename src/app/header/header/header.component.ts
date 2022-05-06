import { Component, OnInit } from '@angular/core';
import { NewsMainService } from 'src/app/news/news-main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isCollapsed = true;

  constructor(private newsServise: NewsMainService) {}

  ngOnInit(): void {}

  getNewsData() {
    this.isCollapsed = !this.isCollapsed;
    this.newsServise.fetchNewsData();
  }
}
