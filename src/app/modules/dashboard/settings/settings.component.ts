import {Component, OnInit} from '@angular/core';
import {StateWatchService} from '../../../services/state-watch.service';

@Component({
  selector: 'tmt-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  autoSync = false;

  constructor(private stateWatchService: StateWatchService) {
  }

  ngOnInit() {
  }

  switchOnAll() {
    this.stateWatchService.switchOnAll();
  }

  switchOffAll() {
    this.stateWatchService.switchOffAll();
  }

  switchOnMotor() {
    this.stateWatchService.switchOnMotor(arguments[0]);
  }

  switchOffMotor() {
    this.stateWatchService.switchOffMotor(arguments[0]);
  }

  updateRotability(id, event) {
    this.stateWatchService.updateRotability(id, event.target.value);
  }

  updateDescription(id, event) {
    this.stateWatchService.updateDescription(id, event.target.value);
  }

  autoSyncAll() {
    this.autoSync = true;
    this.stateWatchService.autoSyncAll();
  }

  stopAutoSyncAll() {
    this.autoSync = false;
    this.stateWatchService.stopAutoSyncAll();
  }

  resetAutoSyncAll() {
    this.stateWatchService.resetAutoSyncAll();
  }

}
