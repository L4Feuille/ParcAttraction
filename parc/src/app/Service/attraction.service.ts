import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DataService } from './data.service';
import { AttractionInterface, CritiqueInterface } from '../Interface/attraction.interface';
import { MessageInterface } from '../Interface/message.interface';

@Injectable({
  providedIn: 'root',
})
export class AttractionService {

  constructor(private dataService: DataService) {

  }

  public getAllAttraction() : Observable<AttractionInterface[]> {
    const url = "http://127.0.0.1:5000/attraction";
    const data = this.dataService.getData(url);
    return data as Observable<AttractionInterface[]>;
  }

  public postAttraction(attraction: AttractionInterface): Observable<MessageInterface> {
    const url = "http://127.0.0.1:5000/attraction";
    const data = this.dataService.postData(url, attraction);
    return data as Observable<MessageInterface>;
  }

  public getCritiques(attractionId: number): Observable<CritiqueInterface[]>{
    const url = `http://127.0.0.1:5000/critique?attraction_id=${attractionId}`;
    const data = this.dataService.getData(url);
    return data as Observable<CritiqueInterface[]>;
  }

  public postCritiques(critique: CritiqueInterface): Observable<MessageInterface>{
    const url = "http://127.0.0.1:5000/critique";
    const data = this.dataService.postData(url, critique);
    return data as Observable<MessageInterface>;
  }
}