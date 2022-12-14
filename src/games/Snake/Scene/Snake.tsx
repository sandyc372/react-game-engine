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
  const tail = apprComponent.occupancyMatrix[apprComponent.occupancyMatrix.length - 1];

  const segAfterHead = apprComponent.occupancyMatrix[1];
  const segBeforetail = apprComponent.occupancyMatrix[apprComponent.occupancyMatrix.length - 2];

  let headRadii = [0];
  let tailRadii = [0];

  if (head[0] === segAfterHead[0]) {
    if (head[1] < segAfterHead[1]) {
      headRadii = [5, 5, 0, 0]
    } else {
      headRadii = [0, 0, 5, 5]
    }
  } else {
    if (head[0] < segAfterHead[0]) {
      headRadii = [5, 0, 0, 5]
    } else {
      headRadii = [0, 5, 5, 0]
    }
  }

  if (tail[0] === segBeforetail[0]) {
    if (tail[1] < segBeforetail[1]) {
      tailRadii = [5, 5, 0, 0]
    } else {
      tailRadii = [0, 0, 5, 5]
    }
  } else {
    if (tail[0] < segBeforetail[0]) {
      tailRadii = [5, 0, 0, 5]
    } else {
      tailRadii = [0, 5, 5, 0]
    }
  }

  return <React.Fragment>{
    apprComponent.occupancyMatrix.map(
      ([x, y]: number[], i: number) => <canvasrect
        key={x + '-' + y}
        x={x * tileWidth + startX}
        y={y * tileHeight + startY}
        width={tileWidth}
        height={tileHeight}
        fill={apprComponent.fill}
        stroke={'transparent'}
        strokeWeight={1}
        radii={i === 0 ? headRadii : i === apprComponent.occupancyMatrix.length - 1 ? tailRadii : undefined}
      />
    )}
    <canvascircle
      x={head[0] * tileWidth + startX + tileWidth / 2}
      y={head[1] * tileHeight + startY + tileHeight / 4}
      r={0.1 * tileWidth}
      fill='white'
      stroke='#707070'
      strokeWeight={5}
    />
    <canvascircle
      x={head[0] * tileWidth + startX + tileWidth / 2}
      y={head[1] * tileHeight + startY + tileHeight * 0.75}
      r={0.1 * tileWidth}
      fill='white'
      stroke='#707070'
      strokeWeight={5}
    />
  </React.Fragment>
})