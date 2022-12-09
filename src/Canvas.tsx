import React from 'react';
import { Game } from './Main/Game';
import { CanvasRenderer as NativeCanvasRenderer } from './canvasReconciler';
import { createNode } from './canvasDom';
import { CanvasTreeRenderer } from './CanvasTreeRenderer';
import { SceneManager as SnakeGame } from './games/Snake/SceneManager';

export const CanvasWrapper = (props: any) => {
  const canvasRef = React.useRef<any>();
  const rootNodeRef = React.useRef(createNode('root'));
  const rendererRef = React.useRef<CanvasTreeRenderer>(new CanvasTreeRenderer(canvasRef.current, rootNodeRef.current));
 
  React.useEffect(() => {
    rendererRef.current.canvasRef = canvasRef.current;
    NativeCanvasRenderer.render(<Game canvasRef={canvasRef} rendererRef={rendererRef}><SnakeGame/></Game>, rootNodeRef.current)
  }, []);


  return <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw'
  }}>
    <canvas ref={canvasRef} width={500} height={500} tabIndex={0}/>
  </div>
}