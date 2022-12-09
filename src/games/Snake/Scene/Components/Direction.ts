import { makeAutoObservable } from 'mobx';

export class Direction {
  value: string = 'up'

  constructor(direction: string) {
    makeAutoObservable(this);
    this.value = direction;
  }
}