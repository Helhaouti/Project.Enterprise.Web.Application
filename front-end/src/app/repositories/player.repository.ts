import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {UpdateUserRequest} from "../domain/dto/UpdateUserRequest";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class PlayerRepository {
  public static readonly PLAYER_SERVER_ROUTE = `${environment.apiUrl}/player`;

  public constructor(private http: HttpClient) {
  }

  public update(
    updateUserRequest: UpdateUserRequest,
    onSucces: (data: any) => void,
    onError: (error: any) => void
  ): Subscription {
    return this.http.put(
      `${PlayerRepository.PLAYER_SERVER_ROUTE}/details`,
      updateUserRequest.toJson(),
      {observe: 'response'}
    ).subscribe(onSucces, onError);
  }
}
