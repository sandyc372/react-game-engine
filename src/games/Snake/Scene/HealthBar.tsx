import { observer } from 'mobx-react-lite';
import React from 'react';

export interface IHealthBarProps {
  x: number;
  y: number;
  height: number;
  health: number;
}

export const interpolator = () => {}

export const HealthBar = observer((props: IHealthBarProps) => {
  const { x, y, height, health } = props;
  const bars = [];
  for (let i = 0; i < health; i++) {
    bars.push(<canvascircle
      x={(i * (height + x)) + height/2 + x}
      y={y}
      r={height / 2}
      fill='#8fdf76'
      strokeWeight={2}
      key={i}
    />)
  }
  return <React.Fragment>{bars}</React.Fragment>
});