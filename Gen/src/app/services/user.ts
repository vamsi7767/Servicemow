import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = 'http://localhost:9000/api/auth';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  updatePassword(id: number, newPassword: string): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}/password`, newPassword);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
