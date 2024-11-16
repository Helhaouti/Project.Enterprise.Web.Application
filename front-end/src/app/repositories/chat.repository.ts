import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Chat} from "../domain/models/game/chat";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatRepository {
  public readonly API_URL = `${environment.apiUrl}/gamechat`;

  constructor(
    private http: HttpClient,
  ) {
  }

  public getAllByGameId(id): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.API_URL}/${id}`);
  }

  public createChat(chat: Chat): void {
    this.http.post<Chat>(`${this.API_URL}/`, chat.toJson()).subscribe();
  }

  public clearChat(id): void {
    this.http.delete<Chat>(`${this.API_URL}/${id}`).subscribe();
  }
}
