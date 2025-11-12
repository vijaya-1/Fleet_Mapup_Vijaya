import { Component, OnInit } from '@angular/core';
import { FleetService } from '../../services/fleet.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  events: any[] = [];
  trips: any[] = [];
  fleetSummary = { totalTrips: 0, half: 0, eighty: 0, completed: 0 };
  speed = 1;
  isPlaying = false;
  interval: any;

  constructor(private fleetService: FleetService) {}

  ngOnInit() {
    this.loadFleetData();
  }

  loadFleetData() {
    this.fleetService.getFleetData().subscribe((data) => {
      this.events = data;
      this.trips = this.extractTrips();
      this.updateFleetSummary();
    });
  }

  extractTrips() {
    const grouped: any = {};
    this.events.forEach((event) => {
      if (!grouped[event.tripId]) grouped[event.tripId] = [];
      grouped[event.tripId].push(event);
    });
    return Object.keys(grouped).map((id) => ({
      id,
      progress: this.calculateProgress(grouped[id])
    }));
  }

  calculateProgress(tripEvents: any[]) {
    const lastEvent = tripEvents[tripEvents.length - 1];
    return lastEvent.progress || Math.floor(Math.random() * 100);
  }

  updateFleetSummary() {
    const progressList = this.trips.map((t) => t.progress);
    this.fleetSummary.totalTrips = this.trips.length;
    this.fleetSummary.half = progressList.filter((p) => p >= 50 && p < 80).length;
    this.fleetSummary.eighty = progressList.filter((p) => p >= 80 && p < 100).length;
    this.fleetSummary.completed = progressList.filter((p) => p >= 100).length;
  }

  toggleSimulation() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) this.startSimulation();
    else clearInterval(this.interval);
  }

  startSimulation() {
    let index = 0;
    this.interval = setInterval(() => {
      if (index < this.events.length) {
        const event = this.events[index++];
        const trip = this.trips.find((t) => t.id === event.tripId);
        if (trip) trip.progress = event.progress;
        this.updateFleetSummary();
      } else {
        clearInterval(this.interval);
      }
    }, 1000 / this.speed);
  }

  changeSpeed(factor: number) {
    this.speed = factor;
    if (this.isPlaying) {
      clearInterval(this.interval);
      this.startSimulation();
    }
  }
}
