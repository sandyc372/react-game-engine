import { observer } from 'mobx-react-lite';
import React from 'react';
import GameContext from '../../../Main/GameContext';
import { Grid } from '../../../Main/Grid';
import { Snake } from './Snake';

export interface IPlayAreaProps {
  startX: number;
  startY: number;
  width: number;
  height: number;
  gridSize: number;
}

export const PlayArea = observer((props: IPlayAreaProps) => {
  const { startX, startY, width, height, gridSize } = props;
  const gameContext = React.useContext(GameContext);
  const { ecs, eventProvider } = gameContext;
  const sceneEntities = ecs.entityMap.get('scene2');
  const snakeEntity = sceneEntities?.get('snake');
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
    />
  </canvaslayer>;
})