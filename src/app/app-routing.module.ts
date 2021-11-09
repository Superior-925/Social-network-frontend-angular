import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from "./components/home-page/home-page.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {FriendsComponent} from "./components/friends/friends.component";

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'friends/:id', component: FriendsComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
