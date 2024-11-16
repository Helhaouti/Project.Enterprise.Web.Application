import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {PageNotFoundComponent} from "./components/shared/page-not-found/page-not-found.component";
import {AdminWrapperComponent} from "./components/admin/admin-wrapper/admin-wrapper.component";
import {GameOverviewComponent} from "./components/game/game-overview/game-overview.component";
import {LogInComponent} from "./components/authentication/log-in/log-in.component";
import {RegistrationComponent} from "./components/authentication/registration/registration.component";
import {CreateGameComponent} from "./components/game/game-create/create-game.component";
import {GameWrapperComponent} from "./components/game/game-wrapper/game-wrapper.component";
import {AdminRoleAuthGuardService} from "./services/route-guard/admin-role-auth-guard.service";
import {PlayerRoleAuthGuardService} from "./services/route-guard/player-role-auth-guard.service";
import {CredentialPageAuthGuardService} from "./services/route-guard/credential-page-auth-guard.service";
import {MyProfileComponent} from "./components/profile/my-profile/my-profile.component";
import {RulesInstructionsComponent} from "./components/game/rules-instructions/rules-instructions.component";
import {GameLobbyComponent} from "./components/game/game-wrapper/game-lobby/game-lobby.component";
import {GamePlayComponent} from "./components/game/game-wrapper/game-play/game-play.component";
import {GameInfoComponent} from "./components/game/game-wrapper/game-info/game-info.component";

const ADMIN_ROUTES: Routes = [];
const GAME_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'lobby',
    pathMatch: 'full',
  },
  {
    path: 'play', component: GamePlayComponent,
    canActivate: [PlayerRoleAuthGuardService],
  },
  {
    path: 'lobby', component: GameLobbyComponent,
    canActivate: [PlayerRoleAuthGuardService],
  },
  {
    path: 'info', component: GameInfoComponent,
    canActivate: [PlayerRoleAuthGuardService]
  }
];
const PROFILE_ROUTES: Routes = [];

const APP_ROUTES: Routes = [
  {
    path: 'login', component: LogInComponent,
    canActivate: [CredentialPageAuthGuardService]
  },
  {
    path: 'register', component: RegistrationComponent,
    canActivate: [CredentialPageAuthGuardService]
  },
  {
    path: 'rules', component: RulesInstructionsComponent
  },
  {
    path: 'admin', component: AdminWrapperComponent,
    children: ADMIN_ROUTES,
    canActivate: [AdminRoleAuthGuardService]
  },
  {
    path: 'game', component: GameOverviewComponent,
    canActivate: [PlayerRoleAuthGuardService]
  },
  {
    path: 'game/create', component: CreateGameComponent,
    canActivate: [PlayerRoleAuthGuardService]
  },
  {
    path: 'game/:id', component: GameWrapperComponent,
    canActivate: [PlayerRoleAuthGuardService],
    children: GAME_ROUTES,
  },
  {
    path: 'profile', component: MyProfileComponent,
    children: PROFILE_ROUTES,
    canActivate: [PlayerRoleAuthGuardService]
  },
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent},
];

/**
 * The central routing configuration of this angular application. With routes for: login, register,
 * admin, game, profile and home. And a redirect to error page in case a page is nonexistent.
 *
 * @author Hamza el Haouti
 */
@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
