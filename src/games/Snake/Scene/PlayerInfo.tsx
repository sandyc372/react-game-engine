import { observer } from 'mobx-react-lite';
import React from 'react';
import GameContext from '../../../Main/GameContext';

const padding = 10;
export interface IPlayerInfoProps {
  startX: number;
  startY: number;
  width: number;
  height: number;
}

export const PlayerInfo = observer((props: IPlayerInfoProps) => {
  const { startX, startY, width, height } = props;
  const gameContext = React.useContext(GameContext);
  const { ecs } = gameContext;
  const sceneEntities = ecs.entityMap.get('scene2');
  const snakeEntity = sceneEntities?.get('snake');

  const health = snakeEntity?.components.get('health')?.value ?? ''

  return <canvaslayer>
    <canvastext
      content={'Health: ' + health}
      point={[startX + padding, height/2]}
      textAlign='left'
      textBaseline='middle'
      fill='green'
      font='bold 22px monospace'
    />
    <canvastext
      content={'Score: 0'}
      point={[width - padding, height/2]}
      textAlign='right'
      textBaseline='middle'
      fill='blue'
      font='bold 22px monospace'
    />
  </canvaslayer>;
})