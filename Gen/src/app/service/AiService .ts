import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AiService {
  private baseUrl = 'http://localhost:9000/api/ai';

  constructor(private http: HttpClient) {}

  askAI(title: string): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/chat`,
      { prompt: title },
      { responseType: 'text' }
    );
  }

  fixGrammar(text: string): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/fix-grammar`,
      { text },
      { responseType: 'text' }
    );
  }
}