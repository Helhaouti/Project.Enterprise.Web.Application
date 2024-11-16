import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {GameSession} from "../domain/models/game/GameSession";
import {CreateGameRequest} from "../domain/dto/CreateGameRequest.dto";
import {Injectable} from "@angular/core";
import {UpdateGameRequest} from "../domain/dto/UpdateGameRequest.dto";
import {Player} from "../domain/models/game/Player";

@Injectable({
  providedIn: 'root'
})
export class GameRepository {
  public static readonly API_URL = `${environment.apiUrl}/game`;

  constructor(
    private http: HttpClient,
  ) {
  }

  public getBy(
    id: number,
    onSucces: (arg0: GameSession) => void,
    onError: (arg0: any) => void
  ): void {
    this.http.get<GameSession>(`${GameRepository.API_URL}/${id}`)
      .subscribe(onSucces, onError);
  }

  public getAllJoinable(
    onSucces: (arg0: any) => void,
    onError: (arg0: any) => void
  ): void {
    this.http.get<GameSession[]>(`${GameRepository.API_URL}`)
      .subscribe(onSucces, onError);
  }

  public getCurrentUserHistory(
    onSucces: (arg0: any) => void,
    onError: (arg0: any) => void
  ): void {
    this.http.get<GameSession[]>(`${GameRepository.API_URL}/history`)
      .subscribe(onSucces, onError);
  }

  public joinBy(
    id: number,
    onSucces: (arg0: GameSession) => void,
    onError: (arg0: any) => void
  ): void {
    this.http.post<GameSession>(`${GameRepository.API_URL}/${id}/join`, null)
      .subscribe(onSucces, onError);
  }

  public create(
    request: CreateGameRequest,
    onSucces: (arg0: GameSession) => void,
    onError: (arg0: any) => void
  ): void {
    this.http.post<GameSession>(`${GameRepository.API_URL}/create`, request.toJson())
      .subscribe(onSucces, onError);
  }

  public update(
    request: UpdateGameRequest,
    gameId: number,
    onSucces: (arg0: GameSession) => void,
    onError: (arg0: any) => void
  ): void {
    this.http.put<GameSession>(`${GameRepository.API_URL}/${gameId}/update`, request.toJson())
      .subscribe(onSucces, onError);
  }

  public leaveGame(
    playerId: number,
    gameId: number,
    onSucces: (arg0: Player) => void,
    onError: (arg0: any) => void
  ): void {
    this.http.post<Player>(`${GameRepository.API_URL}/${gameId}/leave/${playerId}`, null)
      .subscribe(onSucces, onError);
  }

}





