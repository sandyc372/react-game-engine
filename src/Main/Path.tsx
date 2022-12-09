import React from 'react';
import { WIDTH, HEIGHT, GRID_SIZE } from './Game';

export interface IPathProps {
  pathSegments: number[][];
  indexInPath: number
}

export const Path = (props: IPathProps) => {
  const {pathSegments, indexInPath} = props;
  const tileWidth = WIDTH / GRID_SIZE;
  const tileHeight = HEIGHT / GRID_SIZE;
  return <React.Fragment>
    { pathSegments.map((seg, i) => <canvasrect key={seg[0] + '' + seg[1] + '' + i} x={seg[0] * tileWidth} y={seg[1] * tileHeight} width={tileWidth} height={tileHeight} fill={i > indexInPath ? 'transparent' : '#c0c0c0'} stroke={i > indexInPath ? 'transparent' :'#c0c0c0'} />)}
  </React.Fragment>
}