import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

/**
 * Service for the retrieval, modification and deletion of a profile pictures of a user.
 *
 * @author Hamza el Haouti
 */
@Injectable({
  providedIn: 'root'
})
export class ProfilePictureRepository {
  public static readonly PROFILE_PIC_SERVER_ROUTE = `${environment.apiUrl}/player/profile-pic`;

  constructor(private http: HttpClient) {
  }

  public upload(data: FormData, userId: number): Observable<any> {
    return this.http.put<FormData>(
      `${ProfilePictureRepository.PROFILE_PIC_SERVER_ROUTE}/${userId}`,
      data,
      {headers: {}, observe: 'events'}
    );
  }

  public getBy(userId: number): Observable<any> {
    return this.http.get<File>(
      `${ProfilePictureRepository.PROFILE_PIC_SERVER_ROUTE}/${userId}`,
      {
        observe: 'events',
        // @ts-ignore
        responseType: 'arraybuffer'
      }
    );
  }

  public deleteBy(userId: number): Observable<any> {
    return this.http.delete(
      `${ProfilePictureRepository.PROFILE_PIC_SERVER_ROUTE}/${userId}`,
      {observe: 'events'}
    );
  }
}
