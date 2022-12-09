import { makeAutoObservable } from 'mobx';

export class Appearance {
  occupancyMatrix: number[] | number[][] = []

  constructor(occupancyMatrix: number[] | number[][]) {
    makeAutoObservable(this);
    this.occupancyMatrix = occupancyMatrix;
  }
}