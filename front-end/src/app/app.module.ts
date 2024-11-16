import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './components/home/home.component';
import {PageNotFoundComponent} from './components/shared/page-not-found/page-not-found.component';
import {SiteNavComponent} from './components/shared/site-nav/site-nav.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AdminWrapperComponent} from './components/admin/admin-wrapper/admin-wrapper.component';
import {GameOverviewComponent} from './components/game/game-overview/game-overview.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {LogInComponent} from './components/authentication/log-in/log-in.component';
import {RegistrationComponent} from './components/authentication/registration/registration.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatStepperModule} from "@angular/material/stepper";
import {MatSelectModule} from "@angular/material/select";
import {StandardSnackbarComponent} from './services/snackbar/standard-snackbar/standard-snackbar.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AuthInterceptor} from "./services/interceptor/auth-interceptor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MyProfileComponent} from './components/profile/my-profile/my-profile.component';
import {MatMenuModule} from "@angular/material/menu";
import {UserDetailsComponent} from './components/profile/user-details/user-details.component';
import {CreateGameComponent} from './components/game/game-create/create-game.component';
import {LocationComponent} from './components/game/game-wrapper/game-play/game-board/location/location.component';
import {
  ProfilePicManagerComponent
} from './components/profile/my-profile/profile-pic-manager/profile-pic-manager.component';
import {
  UserDetailChangeConformationComponent
} from './components/profile/user-details/user-detail-change-conformation/user-detail-change-conformation.component';
import {MatDialogModule} from "@angular/material/dialog";
import {RulesInstructionsComponent} from './components/game/rules-instructions/rules-instructions.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {DiceComponent} from './components/game/dice/dice.component';
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatTabsModule} from "@angular/material/tabs";
import {GameBoardComponent} from './components/game/game-wrapper/game-play/game-board/game-board.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRippleModule} from "@angular/material/core";
import {GamePlayComponent} from "./components/game/game-wrapper/game-play/game-play.component";
import {GameWrapperComponent} from './components/game/game-wrapper/game-wrapper.component';
import {GameLobbyComponent} from './components/game/game-wrapper/game-lobby/game-lobby.component';
import {
  PlayerProfilePictureComponent
} from './components/game/game-wrapper/player-profile-picture/player-profile-picture.component';
import {MatCardModule} from "@angular/material/card";
import {
  GameActionOverviewComponent
} from './components/game/game-wrapper/game-play/side-view/game-action-overview/game-action-overview.component';
import {
  LeaderboardOverviewComponent
} from './components/game/game-wrapper/game-play/side-view/leaderboard-overview/leaderboard-overview.component';
import {LocationPopupComponent} from './components/game/game-wrapper/game-play/location-popup/location-popup.component';
import {
  PickCardLocationPopUpComponent
} from "./components/game/pick-card-location-pop-up/pick-card-location-pop-up.component";
import {
  GameTurnTrackerComponent
} from './components/game/game-wrapper/game-play/game-turn-tracker/game-turn-tracker.component';
import {GameSummaryComponent} from './components/game/game-wrapper/game-summary/game-summary.component';
import {
  PlayerInformationOverviewPopUpComponent
} from './components/game/game-wrapper/game-play/player-information-overview-pop-up/player-information-overview-pop-up.component';
import {ChatComponent} from './components/game/game-wrapper/game-play/chat/chat.component';
import {EditSettingsPopUpComponent} from "./components/pop-ups/edit-settings-pop-up/edit-settings-pop-up.component";
import {
  GameSettingsOverviewPlayerComponent
} from "./components/game/game-wrapper/game-play/side-view/game-settings-overview-player/game-settings-overview-player.component";
import {
  GameSettingsOverviewComponent
} from "./components/game/game-wrapper/game-play/side-view/game-settings-overview-admin/game-settings-overview.component";
import {GameInfoComponent} from "./components/game/game-wrapper/game-info/game-info.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    SiteNavComponent,
    AdminWrapperComponent,
    GameOverviewComponent,
    LogInComponent,
    RegistrationComponent,
    CreateGameComponent,
    StandardSnackbarComponent,
    MyProfileComponent,
    UserDetailsComponent,
    GamePlayComponent,
    ProfilePicManagerComponent,
    UserDetailChangeConformationComponent,
    RulesInstructionsComponent,
    DiceComponent,
    LocationComponent,
    GameBoardComponent,
    GameWrapperComponent,
    GameLobbyComponent,
    PlayerProfilePictureComponent,
    GameActionOverviewComponent,
    LeaderboardOverviewComponent,
    LocationPopupComponent,
    PickCardLocationPopUpComponent,
    GameTurnTrackerComponent,
    GameSummaryComponent,
    PlayerInformationOverviewPopUpComponent,
    GameSettingsOverviewComponent,
    EditSettingsPopUpComponent,
    GameSettingsOverviewPlayerComponent,
    ChatComponent,
    GameInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatSelectModule,
    FormsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatDialogModule,
    MatExpansionModule,
    MatBottomSheetModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatRippleModule,
    MatCardModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
