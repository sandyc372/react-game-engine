import React from 'react';
import { WIDTH, HEIGHT, GRID_SIZE, tileHeight, tileWidth } from '../../../Main/Game';
import GameContext from '../../../Main/GameContext';
import { EVENTS } from '../../../Main/EventProvider';
import { Entity } from '../../../ECS/Entity';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

let lastMoved: number = 0;

const isOppositeDir = (currDir: string, targetDir: string) => {
  switch(currDir) {
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

export interface ISnakeProps {
  entity?: Entity
}

export const Snake = observer((props: ISnakeProps) => {
  const { entity } = props;
  const gameContext = React.useContext(GameContext);
  const { eventProvider } = gameContext;

  React.useLayoutEffect(() => {
    if (!entity) {
      return
    }

    const setDirection = (direction: string, isDown: boolean) => {
      const directionComponent = entity.components.get('direction')!;
      if (isDown && !isOppositeDir( directionComponent.value, direction)) {
        directionComponent.value = direction
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

      const direction = directionComponent.value;
      const length = lengthComponent.value;

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

      if (newOccMatrix.every(el => {
        const x = el[0];
        const y = el[1];
        return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE
      })) {
        lastMoved = Date.now();
        runInAction(() => {
          apprComponent.occupancyMatrix = newOccMatrix;
        })
      }
    }

    eventProvider.on(EVENTS.UPDATE, moveSnake);
    return () => eventProvider.off(EVENTS.UPDATE, moveSnake);
  }, [entity])

  if (!entity) {
    return null
  }

  const apprComponent = entity.components.get('appearance')!;
  
  return apprComponent.occupancyMatrix.map(
    ([x, y]: number[]) => <canvasrect key={x + '' + y} x={x * tileWidth} y={y * tileHeight} width={tileWidth} height={tileHeight} fill={'#707070'} stroke={'transparent'} strokeWeight={1} />
  )
})