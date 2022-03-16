import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, interval, map, Observable, of, range, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  public counter = new BehaviorSubject<number>(0);

  constructor() { }

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

}
