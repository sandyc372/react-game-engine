import { makeAutoObservable } from 'mobx';
import { Entity } from './Entity';

export class ECS {
  entityMap: Map<string, Map<string, Entity>> = new Map();

  constructor() {
    makeAutoObservable(this);
  }
}