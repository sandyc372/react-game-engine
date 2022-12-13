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

  if (!entity) {
    return null
  }

  const apprComponent = entity.components.get('appearance')!;
  const head = apprComponent.occupancyMatrix[0];

  return <React.Fragment>{
    apprComponent.occupancyMatrix.map(
      ([x, y]: number[]) => <canvasrect key={x + '' + y} x={x * tileWidth + startX} y={y * tileHeight + startY} width={tileWidth} height={tileHeight} fill={apprComponent.fill} stroke={'transparent'} strokeWeight={1} />
    )}
    <canvascircle
      x={head[0] * tileWidth + startX + tileWidth/2}
      y={head[1] * tileHeight + startY + tileHeight/2}
      r={0.2 * tileWidth}
      fill='white'
      stroke='black'
      strokeWeight={5}
    />
  </React.Fragment>
})