import { makeAutoObservable } from 'mobx';

export class Direction {
  value: string = 'up';
  isStopped = false;

  constructor(direction: string) {
    makeAutoObservable(this);
    this.value = direction;
  }
}