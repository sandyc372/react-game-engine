import { makeAutoObservable } from 'mobx';

export class Entity {
  uid: string = ''
  name: string = '';
  components: Map<string, any> = new Map()

  constructor(uid: string, name: string) {
    makeAutoObservable(this, { uid: false, name: false });
    this.uid = uid;
    this.name = uid;
  }

}