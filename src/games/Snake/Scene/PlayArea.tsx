import { observer } from 'mobx-react-lite';
import React from 'react';
import GameContext from '../../../Main/GameContext';
import { Grid } from '../../../Main/Grid';
import { Food } from './Food';
import { Snake } from './Snake';

export interface IPlayAreaProps {
  startX: number;
  startY: number;
  width: number;
  height: number;
  gridSize: number;
  turnSnake: any;
}

export const PlayArea = observer((props: IPlayAreaProps) => {
  const { startX, startY, width, height, gridSize, turnSnake } = props;
  const gameContext = React.useContext(GameContext);
  const { ecs, eventProvider } = gameContext;
  const sceneEntities = ecs.entityMap.get('scene2');
  const snakeEntity = sceneEntities?.get('snake');
  const foodEntity = sceneEntities?.get('food');
  return <canvaslayer>
    <Grid
      startX={startX}
      startY={startY}
      width={width}
      height={height}
      gridSize={gridSize}
    />
    <Snake
      entity={snakeEntity}
      startX={startX}
      startY={startY}
      width={width}
      height={height}
      gridSize={gridSize}
      turn={turnSnake}
    />
    <Food
      entity={foodEntity}
      startX={startX}
      startY={startY}
      width={width}
      height={height}
      gridSize={gridSize}
    />
  </canvaslayer>;
})