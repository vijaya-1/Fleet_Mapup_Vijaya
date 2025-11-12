import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  constructor() {}

  calculateETA(progress: number, totalDistance = 100): number {
    return Math.round(((100 - progress) / 100) * totalDistance);
  }
}
