import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "../home/home.component";
import {AuthGuard} from "./guards/auth.guard";
import {BaseLayoutComponent} from "../_layouts/base-layout/base-layout.component";
import {PageNotFoundComponent} from "../page-not-found/page-not-found.component";
import {ErrorComponent} from "../error/error.component";

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: 'home', component: HomeComponent},
      { path: 'dismissed', component: HomeComponent},
    ],
    canActivate: [AuthGuard]
  },
  {path: 'error', component: ErrorComponent, data: {breadcrumb: "ERRORS.ERROR"}},
  {path: '**', component: PageNotFoundComponent, data: {breadcrumb: "404"}}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
  ],
  declarations: []
})
export class AppRoutingModule { }
