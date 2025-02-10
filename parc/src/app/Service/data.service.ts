import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor(private http: HttpClient) { }

  public getData(url: string) {
    let data = this.http.get(url);
    return data;
  }

  public postData(url: string, data: any) {
    let result = this.http.post(url, data);
    return result;
  }

  public deleteData(url: string) {
    let result = this.http.delete(url);
    return result;
  }

  public uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ message: string; path: string }>('http://127.0.0.1:5000/upload', formData);
  }
  
}