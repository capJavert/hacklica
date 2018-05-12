import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from "@angular/cdk/layout";
import {UserInstance} from "../../modules/user/user.instance";

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.less']
})
export class BaseLayoutComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  user = UserInstance;

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }

}
