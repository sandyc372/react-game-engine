import React from 'react';
import GameContext from '../../../Main/GameContext';
import { EVENTS } from '../../../Main/EventProvider';
import { Entity } from '../../../ECS/Entity';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

let lastMoved: number = 0;

const isOppositeDir = (currDir: string, targetDir: string) => {
  switch (currDir) {
    case 'up':
      return targetDir === 'down';
    case 'down':
      return targetDir === 'up';
    case 'left':
      return targetDir === 'right';
    case 'right':
      return targetDir === 'left';
  }
}

const blink = () => {
  let lastFired = 0;
  let curIndex = 0;
  let colors = ['red', '#707070'];
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

export interface ISnakeProps {
  entity?: Entity,
  startX: number;
  startY: number;
  width: number;
  height: number;
  gridSize: number;
}

export const Snake = observer((props: ISnakeProps) => {
  const { entity, startX, startY, width, height, gridSize } = props;
  const gameContext = React.useContext(GameContext);
  const { eventProvider } = gameContext;
  const tileHeight = height / gridSize;
  const tileWidth = width / gridSize;

  React.useLayoutEffect(() => {
    if (!entity) {
      return
    }

    const setDirection = (direction: string, isDown: boolean) => {
      const directionComponent = entity.components.get('direction')!;
      if (isDown && !isOppositeDir(directionComponent.value, direction)) {
        directionComponent.value = direction;
        directionComponent.isStopped = false;
      }
    }

    const setUpKeyState = (evt: any, isDown: boolean) => setDirection('up', isDown)
    const setDownKeyState = (evt: any, isDown: boolean) => setDirection('down', isDown)
    const setLeftKeyState = (evt: any, isDown: boolean) => setDirection('left', isDown)
    const setRightKeyState = (evt: any, isDown: boolean) => setDirection('right', isDown)

    eventProvider.on(EVENTS.KEY_W, setUpKeyState);
    eventProvider.on(EVENTS.KEY_A, setLeftKeyState);
    eventProvider.on(EVENTS.KEY_S, setDownKeyState);
    eventProvider.on(EVENTS.KEY_D, setRightKeyState);

    return () => {
      eventProvider.off(EVENTS.KEY_W, setUpKeyState);
      eventProvider.off(EVENTS.KEY_A, setLeftKeyState);
      eventProvider.off(EVENTS.KEY_S, setDownKeyState);
      eventProvider.off(EVENTS.KEY_D, setRightKeyState);
    }
  }, [entity]);

  React.useLayoutEffect(() => {
    const blinker = blink()
    const moveSnake = () => {
      if (!entity) {
        return
      }

      if (Date.now() - lastMoved < 50) {
        return
      }

      const apprComponent = entity.components.get('appearance')!;
      const directionComponent = entity.components.get('direction')!;
      const lengthComponent = entity.components.get('length')!;
      const healthComponent = entity.components.get('health')!;

      const direction = directionComponent.value;
      const length = lengthComponent.value;

      if (directionComponent.isStopped) {
        return;
      }

      let delta = [
        direction === 'left' ? -1 : direction === 'right' ? 1 : 0,
        direction === 'up' ? -1 : direction === 'down' ? 1 : 0
      ]

      const newOccMatrix: number[][] = [];
      apprComponent.occupancyMatrix.forEach((el: number[], i: number) => {
        if (i === 0) {
          newOccMatrix.push([el[0] + delta[0], el[1] + delta[1]])
          return
        } else {
          newOccMatrix.push(apprComponent.occupancyMatrix[i - 1])
        }
      })

      if (newOccMatrix.every((el, i) => {
        const x = el[0];
        const y = el[1];
        const isDuplicate: boolean = newOccMatrix.slice(0, i).some(pt => pt[0] === x && pt[1] === y);
        return x >= 0 && x < gridSize && y >= 0 && y < gridSize && !isDuplicate
      })) {
        lastMoved = Date.now();
        runInAction(() => {
          apprComponent.occupancyMatrix = newOccMatrix;
        })
      } else {
        // take damage and stop
        runInAction(() => {
          directionComponent.isStopped = true;
          healthComponent.lastDamageTakenOn = Date.now();
          healthComponent.isRecovering = true;
        })
      }
    }

    const checkDamageState = () => {
      if (!entity) {
        return
      }
      const healthComponent = entity.components.get('health')!;
      const apprComponent = entity.components.get('appearance')!;

      if (healthComponent.isRecovering === true) {
        if ((Date.now() - healthComponent.lastDamageTakenOn) > 2000) {
          // fully recovered
          runInAction(() => {
            healthComponent.isRecovering = false;
          })
        }
        runInAction(() => {
          apprComponent.fill = blinker();
        })
      } else {
        runInAction(() => {
          apprComponent.fill = '#707070';
        })
      }
    }

    const update = () => {
      moveSnake();
      checkDamageState();
    }

    eventProvider.on(EVENTS.UPDATE, update);
    return () => eventProvider.off(EVENTS.UPDATE, update);
  }, [entity])

  if (!entity) {
    return null
  }

  const apprComponent = entity.components.get('appearance')!;

  return apprComponent.occupancyMatrix.map(
    ([x, y]: number[]) => <canvasrect key={x + '' + y} x={x * tileWidth + startX} y={y * tileHeight + startY} width={tileWidth} height={tileHeight} fill={apprComponent.fill} stroke={'transparent'} strokeWeight={1} />
  )
})