import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { NewsMainService } from 'src/app/news/news-main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isCollapsed = true;
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private newsServise: NewsMainService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((userData) => {
      if (userData) {
        this.isAuthenticated = true;
      }
    });
  }

  getNewsData() {
    this.isCollapsed = !this.isCollapsed;
    this.newsServise.fetchNewsData();
  }

  logUserOut() {
    this.authService.logout();
    this.isAuthenticated = false;
  }
}
