import { makeAutoObservable } from 'mobx';

export class Position {
  x = 0;
  y = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    makeAutoObservable(this);
  }
}