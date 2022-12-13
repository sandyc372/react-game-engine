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
      Array.from(Array(gridSize), (el, i) => {
        // i = (i+1) % (gridSize + 1)
        const strokeWeight = 2;

        const rects = [];
        for (let x = startX, dx = 0; dx <= gridSize; dx = dx + 1) {
          rects.push({
            x: x + dx * tileWidth,
            y: startY + i * tileHeight,
            even: (i + dx) % 2
          })
        }
        return <React.Fragment key={i}>
          {rects.map((r, k) => <canvasrect key={i + '' + k} x={r.x} y={r.y} width={tileWidth} height={tileHeight} fill={r.even ? '#f0f0f0' : 'transparent'} strokeWeight={1} stroke={'transparent'}/>)}
          <canvasline  x1={startX} y1={startY} x2={startX + width} y2={startY} strokeWeight={strokeWeight} stroke={'black'}/>
          <canvasline  x1={startX} y1={startY + height} x2={startX + width} y2={startY + height} strokeWeight={strokeWeight} stroke={'black'}/>
          <canvasline  x1={startX} y1={startY} x2={startX} y2={startY + height} strokeWeight={strokeWeight} stroke={'black'}/>
          <canvasline  x1={startX + width} y1={startY} x2={startX + width} y2={startY + height} strokeWeight={strokeWeight} stroke={'black'}/>
        </React.Fragment>
      })
    }
  </React.Fragment>
}