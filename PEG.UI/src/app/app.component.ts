import { Component, OnInit } from '@angular/core';
import { AppAuthenticationService } from './app-authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from './app-routes';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isUserAccessAllowed: boolean = false;
  constructor(public authService: AppAuthenticationService, private router: Router, private activeRoute: ActivatedRoute) {
  }
  ngOnInit() {
    // this.router.events.subscribe(() => {
    //   const currentUrl = this.router.url;
      
    //   if (currentUrl.startsWith('/peg')) {
    //     const newUrl = currentUrl.replace('/peg', '') || '/';
    //     this.router.navigateByUrl(newUrl, { replaceUrl: true });
    //   }
    // });
    if (this.authService.isUserAuthenticated) {

      this.isUserAccessAllowed = true;
      if (window.location.pathname == "/" || window.location.pathname === '') {
        this.router.navigate([AppRoutes.defaultRoute]);
      }

    } else {
      this.isUserAccessAllowed = false;
    }
  }
}
