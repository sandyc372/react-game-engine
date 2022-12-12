import React from 'react';

export interface IGridProps {
  startX: number;
  startY: number;
  width: number;
  height: number;
  gridSize: number;
}

export const Grid = (props: IGridProps) => {
  const { startX, startY, width, height, gridSize } = props;
  const tileHeight = height / gridSize;
  const tileWidth = width / gridSize;

  return <React.Fragment>
    {
      Array.from(Array(gridSize + 1), (el, i) => {
        i = (i+1) % (gridSize + 1)
        const strokeWeight = 2;
        const x1 = startX;
        const y1 = startY + i * tileHeight + (i === 0 ? strokeWeight/2 : i === gridSize ? -strokeWeight/2 : 0);
        const x2 = startX + width;
        const y2 = startY + i * tileHeight + (i === 0 ? strokeWeight/2 : i === gridSize ? -strokeWeight/2 : 0);

        const x3 = startX + i * tileWidth + (i === 0 ? strokeWeight/2 : i === gridSize ? -strokeWeight/2 : 0);
        const y3 = startY;
        const x4 = startX + i * tileWidth + (i === 0 ? strokeWeight/2 : i === gridSize ? -strokeWeight/2 : 0);
        const y4 = startY + height;
        return <React.Fragment key={i}>
          <canvasline  x1={x1} y1={y1} x2={x2} y2={y2} strokeWeight={strokeWeight} stroke={i === 0 || i === gridSize ? 'black' : '#f0f0f0'}/>
          <canvasline  x1={x3} y1={y3} x2={x4} y2={y4} strokeWeight={strokeWeight} stroke={i === 0 || i === gridSize ? 'black' : '#f0f0f0'}/>
        </React.Fragment>
      })
    }
  </React.Fragment>
}