import {Injectable} from '@angular/core';
import {Chat} from "../../domain/models/game/chat";
import {Observable, Subject} from "rxjs";
import {ChatRepository} from "../../repositories/chat.repository";
import {environment} from "../../../environments/environment";
import {GameStateManagerService} from "../game-state-manager/game-state-manager.service";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly WS_URL = `${environment.wsUrl}/chat`;
  socket: WebSocket;
  subject = new Subject<Chat>();
  private attempt: number = 0;

  constructor(
    private gameStateManagerService: GameStateManagerService,
    private chatRes: ChatRepository
  ) {
    this.startWS();
  }

  public startWS() {
    this.socket = this.connect();
    this.socket.onopen = () => {
      console.log("Messages Open");
      this.attempt = 0;
    }
    this.socket.onmessage = (msg) => this.subject.next(msg.data);
    this.socket.onerror = (err) => console.log(err);
    this.socket.onclose = () => {
      console.log("Messages Closed: " + this.attempt + "-3 attempts");
      if (this.attempt < 3) {
        // @ts-ignore
        setTimeout(this.startWS(), 1000)
        this.attempt++;
      }
    }
  }

  public connect(): WebSocket {
    return new WebSocket(this.WS_URL);
  }

  public getMessages(id): Observable<Chat[]> {
    return this.chatRes.getAllByGameId(id);
  }

  public postMessage(message: string, gameId: number): void {
    const time = new Date();
    const user = this.gameStateManagerService.getCurrentPlayer().user;

    const chat = new Chat(message, user, gameId, time);

    this.chatRes.createChat(chat);
    this.socket.send(JSON.stringify(chat.toJson()));
  }

  public clearMessages(id): void {
    this.chatRes.clearChat(id);
    this.socket.send("clearAll");
  }
}
