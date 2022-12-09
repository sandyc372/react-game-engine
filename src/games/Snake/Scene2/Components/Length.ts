import { makeAutoObservable } from 'mobx';

export class Length {
  value: number = 5

  constructor(length: number) {
    makeAutoObservable(this);
    this.value = length;
  }
}