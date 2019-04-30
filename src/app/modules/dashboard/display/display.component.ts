import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemContent} from '../../../models/item-content';
import {StateWatchService} from '../../../services/state-watch.service';
import {from, Subscription} from 'rxjs';

@Component({
  selector: 'tmt-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit, OnDestroy {
  itemObj: ItemContent[];
  stateSubscription: Subscription;

  constructor(private stateWatchService: StateWatchService) {
  }

  ngOnInit() {
    this.stateSubscription = this.stateWatchService.stateSubject.subscribe(
      (item: any[]) => {
        this.itemObj = item;
      }
    );
    this.stateWatchService.emitStateSubject();
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
  }

  getData(): [number, number, number] {
    return [
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100)
    ];
  }
  generateBox(): void {
    const data = this.getData();
    const tile = document.createElement('customer-box1');
    tile.setAttribute('class', 'col-lg-4 col-md-3 col-sm-2');
    tile.setAttribute('a', '' + data[0]);
    tile.setAttribute('b', '' + data[1]);
    tile.setAttribute('c', '' + data[2]);
    const content = document.getElementById('content');
    content.appendChild(tile);
  }

  deleteBox(): void {
    const content = document.getElementsByClassName('dynamicBox');
    const boxList = from(content).subscribe(
      (item) => { item.parentNode.removeChild(item); }
    );
  }

}
