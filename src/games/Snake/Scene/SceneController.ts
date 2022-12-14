import { runInAction } from "mobx";
import { Entity } from "../../../ECS/Entity";

let lastMoved: number = 0;
let allSpaces: number[][] = [];

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

  calculateFoodLocation = (occupiedSpc: number[][], gridSize: any) => {
    if (allSpaces.length === 0) {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          allSpaces.push([i, j])
        }
      }
    }
    const availableSpaces = allSpaces.filter(el => !occupiedSpc.some((el2: number[]) => el[0] === el2[0] && el[1] === el2[1]));
    if (availableSpaces.length !== 0) {
      const location = Math.floor(Math.random() * availableSpaces.length)
      return availableSpaces[location]
    } else {
      // game over; no space to place food
      return null
    }
  }

  moveSnake = (snakeEntity: any, gridSize: any) => {
    if (!snakeEntity) {
      return
    }

    if (Date.now() - lastMoved < 50) {
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
      healthComponent.value = healthComponent.value - 1;
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
      apprComponent.fill = '#707070';
    }
  }

  eatFood = (foodEntity: any, snakeEntity: any, gridSize: any) => {
    const snakeApprComponent = snakeEntity.components.get('appearance');
    const snakeLenComponent = snakeEntity.components.get('length');
    const scoreComponent = snakeEntity.components.get('score');
    const foodPosComponent =  foodEntity.components.get('position');

    if (snakeApprComponent.occupancyMatrix.some((el: number[][]) => el[0] === foodPosComponent.x && el[1] === foodPosComponent.y)) {
      // snake has collided with the food
      scoreComponent.value = scoreComponent.value + 1;
      snakeLenComponent.value = snakeLenComponent.value + 1;
      const newFoodLocation = this.calculateFoodLocation(snakeApprComponent.occupancyMatrix, gridSize);
      if (newFoodLocation) {
        foodPosComponent.x = newFoodLocation[0];
        foodPosComponent.y = newFoodLocation[1]
      }
    }
  }

  update = (sceneEntities: any, gridSize: number) => {
    runInAction(() => {
      const snakeEntity = sceneEntities?.get('snake');
      const foodEntity = sceneEntities?.get('food');

      if (!snakeEntity || !foodEntity) {
        return
      }

      this.moveSnake(snakeEntity, gridSize);
      this.checkDamageState(snakeEntity);
      this.eatFood(foodEntity, snakeEntity, gridSize)
    })
  }
}