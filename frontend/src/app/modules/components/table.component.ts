import {MatDialog, MatPaginator, PageEvent, Sort} from "@angular/material";
import {BaseComponent} from "./base.component";
import {NotificationService} from "../notification/notification.service";
import {HotkeysService} from "angular2-hotkeys";
import {LoaderService} from "../loader/loader.service";
import {WebService} from "../service/web.service";
import {ViewChild, OnInit, AfterViewInit, OnDestroy} from "@angular/core";
import {ServiceDataSource} from "../service/service.data.source";
import {ActivatedRoute, Router} from "@angular/router";
import {ConditionsUtil} from "../utils/ConditionsUtil";
import {TranslateService} from "@ngx-translate/core";

export abstract class TableComponent<T> extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  public dataSource: ServiceDataSource<T>;
  private _pageSize: number;
  private translateSubscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dataService: WebService<T>,
              notificationService: NotificationService,
              _hotkeysService: HotkeysService,
              loader: LoaderService,
              dialog: MatDialog,
              router: Router,
              activatedRoute: ActivatedRoute,
              protected translate: TranslateService) {
    super(notificationService, _hotkeysService, loader, dialog, router, activatedRoute);

    this.dataSource = new ServiceDataSource<T>(this.dataService, this.loader, this.notificationService);

    this.pageSize = 5;
  }

  ngAfterViewInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe(() => {
      this.translate.get('MAIN.PER_PAGE').subscribe(translation => {
        this.paginator._intl.itemsPerPageLabel = translation;
      });
    });
  }

  ngOnDestroy() {
    if (ConditionsUtil.isNotNull(this.translateSubscription)) {
      this.translateSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.routerSubscription = this.activatedRoute.queryParams.subscribe(params => {
      let page = 0;

      if (ConditionsUtil.isNotNullNorEmpty(params["page"]) && params["page"] > 0) {
        page = params["page"] - 1;
      }

      if (ConditionsUtil.isNotNullNorEmpty(params["size"])
        && this.pageSizeOptions.indexOf(+params["size"]) >= 0) {
        this.pageSize = params["size"];
      }

      this.paginator.pageIndex = page;
      this.dataSource.loadData();
    });
  }

  abstract get displayedColumns(): [string];
  protected abstract sort(sort: Sort);
  abstract removeItem(model);

  get pageSizeOptions(): [number] {
    return [5, 10, 25, 50, 100];
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(value: number) {
    this._pageSize = value;
  }

  get pageIndex(): number {
    return this.paginator.pageIndex;
  }

  public onPageChange(event: PageEvent) {
    this.router.navigate(
      ["/" + this.dataService.endpoint],
      { queryParams: {
          page: event.pageIndex + 1,
          size: event.pageSize
        }
      }
    );
  }

  public sortData(sort: Sort) {
    this.sort(sort);
  }
}
