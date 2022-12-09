import React from 'react';
import { Entity } from '../../../ECS/Entity';
import { WIDTH, HEIGHT, GRID_SIZE, tileHeight, tileWidth } from '../../../Main/Game';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

export interface IEnemyProps {
  entity?: Entity
}

export const Enemy = observer((props: IEnemyProps) => {
  const { entity } = props;
  if (!entity) {
    return null
  }
  const positionComponent = entity.components.get('position')!;
  return <canvasrect x={positionComponent.x * tileWidth} y={positionComponent.y * tileHeight} width={tileWidth} height={tileHeight} fill={'cyan'} stroke={'black'} strokeWeight={3} />
})