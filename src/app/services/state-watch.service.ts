import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class StateWatchService {
  stateSubject = new Subject<any[]>();
  private itemConfig = [
    {
      id: 1,
      activity: true,
      rotability: 455,
      description: 'bal bla'
    },
    {
      id: 2,
      activity: false,
      rotability: 455,
      description: 'lorem'
    },
    {
      id: 3,
      activity: false,
      rotability: 455,
      description: 'lorem'
    },
    {
      id: 4,
      activity: false,
      rotability: 455,
      description: 'lorem'
    }
  ];

  constructor(private socket: Socket) {
    this.socket.disconnect();
  }

  emitStateSubject() {
    this.stateSubject.next(this.itemConfig);
  }

  updateRotability(myId: number, newValue: number) {
    const currentItem = this.itemConfig.find((itemObj) => {
      return itemObj.id === myId;
    });
    currentItem.rotability = newValue;
    this.emitStateSubject();
  }

  updateDescription(myId: number, newValue: string) {
    const currentItem = this.itemConfig.find((itemObj) => {
      return itemObj.id === myId;
    });
    currentItem.description = newValue;
    this.emitStateSubject();
  }

  switchOnAll() {
    const len = this.itemConfig.length;
    for (let i = 0; i < len; i++) {
      this.itemConfig[i].activity = true;
    }
    this.emitStateSubject();
  }

  switchOffAll() {
    const len = this.itemConfig.length;
    for (let i = 0; i < len; i++) {
      this.itemConfig[i].activity = false;
    }
    this.emitStateSubject();
  }

  switchOnMotor(myId: number) {
    const currentItem = this.itemConfig.find((itemObj) => {
      return itemObj.id === myId;
    });
    currentItem.activity = true;
    this.emitStateSubject();
  }

  switchOffMotor(myId: number) {
    const currentItem = this.itemConfig.find((itemObj) => {
      return itemObj.id === myId;
    });
    currentItem.activity = false;
    this.emitStateSubject();
  }

  autoSyncAll() {
    this.socket.connect();
    console.log('connected to the Express-API - localhost:3700');
    this.socket.on('dataChanged', (data) => {
      this.itemConfig = data.value;
      this.emitStateSubject();
    });
  }

  stopAutoSyncAll() {
    this.socket.disconnect();
  }

  resetAutoSyncAll() {
    console.log('Reset-events emitted');
    this.socket.emit('resetAll', {
      value: this.itemConfig
    });
  }
}
