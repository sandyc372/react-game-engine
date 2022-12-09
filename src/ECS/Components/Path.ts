import { makeAutoObservable } from 'mobx';

export class Path {
  points: number[][] = [];
  indexInPath: number = 0;

  constructor() {
    makeAutoObservable(this);
  }
}