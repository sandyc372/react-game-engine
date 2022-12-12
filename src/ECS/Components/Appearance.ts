import { makeAutoObservable } from 'mobx';

export class Appearance {
  occupancyMatrix: number[] | number[][] = [];
  fill: string = '#707070';

  constructor(occupancyMatrix: number[] | number[][]) {
    makeAutoObservable(this);
    this.occupancyMatrix = occupancyMatrix;
  }
}