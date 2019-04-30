import {Component, Input, OnInit} from '@angular/core';

@Component({
  // selector: 'tmt-box1',
  templateUrl: './box1.component.html',
  styleUrls: ['./box1.component.css']
})
export class Box1Component implements OnInit {
  @Input() a: number;
  @Input() b: number;
  @Input() c: number;

  constructor() { }

  ngOnInit() {
  }

}
