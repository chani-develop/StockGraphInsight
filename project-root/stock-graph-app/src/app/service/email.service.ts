import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private baseUrl = 'https://localhost:7025/api/Email/send';

  constructor(private http: HttpClient) { }
  /**
   * Sends an email with the provided image in base64 format.
   * @param email The recipient's email address.
   * @param imageBase64 The image in base64 format.
   * @returns An observable of the HTTP response.
   */
 sendEmail(email: string, imageBase64: string) {
    return this.http.post(this.baseUrl, {
      email,
      imageBase64
    });
}
}
