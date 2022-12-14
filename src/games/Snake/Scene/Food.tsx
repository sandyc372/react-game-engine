import { observer } from 'mobx-react-lite';
import React from 'react';
import { Entity } from '../../../ECS/Entity';

export interface IFoodProps {
  entity?: Entity;
  startX: number;
  startY: number;
  width: number;
  height: number;
  gridSize: number;
}

export const Food = observer((props: IFoodProps) => {
  const { entity, startX, startY, width, height, gridSize } = props;
  const tileHeight = height / gridSize;
  const tileWidth = width / gridSize;

  if (!entity) {
    return null
  }
  const posComponent = entity.components.get('position');
  const radius = tileWidth / 2;
  const x = posComponent.x * tileWidth + startX + radius;
  const y = posComponent.y * tileHeight + startY + radius;

  return <canvascircle
    x={x}
    y={y}
    r={radius - 0.3 * radius}
    fill='black'
    stroke='black'
    strokeWeight={0.3 * radius}
  />
})