import { makeAutoObservable } from 'mobx';

export class Score {
  value: number = 0;

  constructor(score: number) {
    makeAutoObservable(this);
    this.value = score;
  }
}