import React from 'react';
import { WIDTH, HEIGHT, GRID_SIZE, tileHeight, tileWidth } from './Game';

export interface IGridProps {
}

export const Grid = (props: IGridProps) => {

  return <React.Fragment>
    {
      Array.from(Array(GRID_SIZE + 1), (el, i) => {
        i = (i+1) % (GRID_SIZE + 1)
        const strokeWeight = 2;
        const x1 = 0;
        const y1 = i * tileHeight + (i === 0 ? strokeWeight/2 : i === GRID_SIZE ? -strokeWeight/2 : 0);
        const x2 = WIDTH;
        const y2 = i * tileHeight + (i === 0 ? strokeWeight/2 : i === GRID_SIZE ? -strokeWeight/2 : 0);

        const x3 =  i * tileWidth + (i === 0 ? strokeWeight/2 : i === GRID_SIZE ? -strokeWeight/2 : 0);
        const y3 = 0;
        const x4 = i * tileWidth + (i === 0 ? strokeWeight/2 : i === GRID_SIZE ? -strokeWeight/2 : 0);
        const y4 = HEIGHT;
        return <React.Fragment key={i}>
          <canvasline  x1={x1} y1={y1} x2={x2} y2={y2} strokeWeight={strokeWeight} stroke={i === 0 || i === GRID_SIZE ? 'black' : '#f0f0f0'}/>
          <canvasline  x1={x3} y1={y3} x2={x4} y2={y4} strokeWeight={strokeWeight} stroke={i === 0 || i === GRID_SIZE ? 'black' : '#f0f0f0'}/>
        </React.Fragment>
      })
    }
  </React.Fragment>
}