import { runInAction } from "mobx";
import { Entity } from "../../../ECS/Entity";

let lastMoved: number = 0;

const blink = () => {
  let lastFired = 0;
  let curIndex = 0;
  let colors = ['#f47174', '#707070'];
  return () => {
    if (lastFired === 0) {
      lastFired = Date.now()
    }
    if (Date.now() - lastFired > 200) {
      lastFired = Date.now();
      curIndex = (curIndex + 1) % 2;
    }
    return colors[curIndex]
  }
}

export class SceneController {
  blinker = blink();

  moveSnake = (snakeEntity: any, gridSize: any) => {
    if (!snakeEntity) {
      return
    }

    if (Date.now() - lastMoved < 100) {
      return
    }

    const apprComponent = snakeEntity.components.get('appearance')!;
    const directionComponent = snakeEntity.components.get('direction')!;
    const lengthComponent = snakeEntity.components.get('length')!;
    const healthComponent = snakeEntity.components.get('health')!;

    const direction = directionComponent.value;
    const length = lengthComponent.value;

    if (directionComponent.isStopped) {
      return;
    }

    let delta = [
      direction === 'left' ? -1 : direction === 'right' ? 1 : 0,
      direction === 'up' ? -1 : direction === 'down' ? 1 : 0
    ]

    let newOccMatrix: number[][] = apprComponent.occupancyMatrix.slice();
    const head = newOccMatrix[0];
    newOccMatrix.unshift([head[0] + delta[0], head[1] + delta[1]])

    if (length <= newOccMatrix.length) {
      newOccMatrix = newOccMatrix.slice(0, length)
    }

    if (newOccMatrix.every((el, i) => {
      const x = el[0];
      const y = el[1];
      const isDuplicate: boolean = newOccMatrix.slice(0, i).some(pt => pt[0] === x && pt[1] === y);
      return x >= 0 && x < gridSize && y >= 0 && y < gridSize && !isDuplicate
    })) {
      lastMoved = Date.now();
      apprComponent.occupancyMatrix = newOccMatrix;
    } else {
      // take damage and stop
      directionComponent.isStopped = true;
      healthComponent.lastDamageTakenOn = Date.now();
      healthComponent.isRecovering = true;
      healthComponent.value =  healthComponent.value - 10;
    }
  }

  checkDamageState = (snakeEntity: any) => {
    if (!snakeEntity) {
      return
    }
    const healthComponent = snakeEntity.components.get('health')!;
    const apprComponent = snakeEntity.components.get('appearance')!;

    if (healthComponent.isRecovering === true) {
      if ((Date.now() - healthComponent.lastDamageTakenOn) > 2000) {
        // fully recovered
        healthComponent.isRecovering = false;
      }
      apprComponent.fill = this.blinker();
    } else {
      apprComponent.fill = '#202020';
    }
  }

  update = (snakeEntity: any, gridSize: number) => {
    runInAction(() => {
      this.moveSnake(snakeEntity, gridSize);
      this.checkDamageState(snakeEntity);
    })
  }
}