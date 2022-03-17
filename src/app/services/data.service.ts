import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, interval, map, Observable, of, range, timer } from 'rxjs';
import { River } from '../model/river';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private readonly API_URL = 'https://erddap.emodnet-physics.eu/erddap/tabledap/EP_ERD_INT_RVFL_AL_TS_NRT.csv0?time%2CRVFL%2CRVFL_QC&EP_PLATFORM_ID=%223130579%22';

  public counter = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  createInterval(): Observable<string> {
    // interval = funzione che genera un numero ogni secondo (1000 ms).
    return interval(1000).pipe(
      filter(number => number % 2 === 0),
      map(number => 'numero ' + number)
    );
  }

  createTimer(): Observable<string> {
    // timer = funzione che genera un numero ogni 5 secondi (5000 ms), con un ritardo (2000ms). Se non ha il ritardo lo farà una volta sola.
    return timer(5000, 2000).pipe(
      filter(number => number % 2 === 0),
      map(number => 'numero ' + number)
    );
  }

  getObservableArray(): Observable<number[]> {
    const array = [0, 5, 8, 12, 6];
    return of(array).pipe(
      map(array => array.map(numb => numb + 1))
    );
  }

  getRange(): Observable<number> {
    // range = genera i numeri nell'intervallo uno dopo l'atro, ma quasi istantaneamente. L'estremo di destra è escluso.
    return range(0, 2000).pipe(
      filter(number => number % 2 === 0)
    );
  }

  getCounter(): Observable<number> {
    return this.counter.pipe(
      map(numb => numb ** numb)
    );
  }

  /**** ESERCIZIO API EMODNET ****/

  getInfo(): Observable<River[]> {
    // return this.http.get<string>(this.API_URL, { responseType: "text" as "json" }).pipe(
    return this.http.get(this.API_URL, { responseType: "text" }).pipe(
      map(this.parseCsv),
      map(this.assignIcon)
      // map(data=>this.parseCsv(data))
    );
  }

  parseCsv(string: string): River[] {
    const lineArray = string.split(/\r?\n/);
    const resultArray: River[] = [];
    for (const line of lineArray) {
      if (line) {
        const newLine = line.split(',');
        const obj: River = { 
          date: new Date(newLine[0]), 
          quantity: parseFloat(newLine[1]) 
        };
        resultArray.push(obj);
      }

    }
    return resultArray;
  }

  assignIcon(array: River[]): River[] {
    for (let i = 0; i < array.length; i++) {
      if (i === 0) {
        array[i].icon = 'start';
      }
      else {
        if (array[i].quantity > array[i - 1].quantity) {
          array[i].icon = 'up';
        }
        else {
          if (array[i].quantity < array[i - 1].quantity) {
            array[i].icon = 'down';
          }
          else {
            array[i].icon = 'equal';
          }
        }
      }
    }
    return array;
  }

}
