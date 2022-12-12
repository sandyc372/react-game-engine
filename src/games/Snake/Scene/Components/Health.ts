import { makeAutoObservable } from 'mobx';

export class Health {
  value: number = 100;
  lastDamageTakenOn: number = 0;
  isRecovering = false;

  constructor(health: number) {
    makeAutoObservable(this);
    this.value = health;
  }
}