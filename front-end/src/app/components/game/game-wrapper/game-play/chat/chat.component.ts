import {Component, OnInit} from '@angular/core';
import {ChatService} from "../../../../../services/game/chat.service";
import {SnackbarService} from "../../../../../services/snackbar/snackbar.service";
import {GameActionService} from "../../../../../services/game/gameActionService";
import {Chat} from "../../../../../domain/models/game/chat";
import {Subscription} from "rxjs";
import {GameStateManagerService} from "../../../../../services/game-state-manager/game-state-manager.service";


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  getWSMessages: Subscription;

  messages: Chat[] = [];
  message: string;
  currentPlayerId: number;
  gameId: number;

  constructor(
    private chatService: ChatService,
    private gameStateManagerService: GameStateManagerService,
    private gameService: GameActionService,
    private snackbar: SnackbarService
  ) {
    this.currentPlayerId = gameStateManagerService.getCurrentPlayer().user.id;
    this.gameId = this.gameService.getGameId();
    const getMessages = chatService.getMessages(this.gameId).subscribe(
      next => {
        this.messages = next;
        getMessages.unsubscribe();
      }
    );

    this.getWSMessages = chatService.subject.subscribe(
      (msg: any) => {
        let data = msg;
        try {
          data = JSON.parse(msg);
        } catch (e) {
          console.log(e);
        }
        if (msg == "clearAll") {
          this.messages = [];
          return;
        }
        if (data.gameId == this.gameId) {
          this.messages.push(data as Chat);
        }
      }
    );
  }

  ngOnInit(): void {
  }

  ngOnDistroy(): void {
    this.getWSMessages.unsubscribe();
  }

  sendMessage() {
    if (this.message.length < 3) {
      this.snackbar.openWarningSnackbar({action: undefined, message: "You're message is to short!"});
      return;
    }
    this.chatService.postMessage(this.message, this.gameId);
    this.message = "";
  }

  clearMessages() {
    this.chatService.clearMessages(this.gameId);
    // this.messages = [];
  }
}
