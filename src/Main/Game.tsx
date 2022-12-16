import React from 'react';
import { EventProvider, EVENTS } from './EventProvider';
import GameContext from './GameContext';
import { CanvasTreeRenderer } from '../CanvasTreeRenderer';
import { ECS } from '../ECS/ECS';

export const HEIGHT = window.innerHeight - 100;
export const WIDTH = HEIGHT;
export const GRID_SIZE = 30;

export const tileWidth = WIDTH / GRID_SIZE;
export const tileHeight = HEIGHT / GRID_SIZE;

export interface IGameProps extends React.PropsWithChildren<any> {
  canvasRef: any;
  rendererRef: React.MutableRefObject<CanvasTreeRenderer>
}

export const Game = (props: IGameProps) => {
  const gameContextValue = React.useRef({
    ecs: new ECS(),
    eventProvider: new EventProvider(),
    canvasRef: props.canvasRef,
    rendererRef: props.rendererRef,
    assets: new Map()
  });

  React.useEffect(() => {
    let ref = gameContextValue.current.canvasRef.current;
    let eventProvider = gameContextValue.current.eventProvider;

    let handleClick = (event: any) => {
      eventProvider.trigger(EVENTS.CLICK, event)
    }
    let handleMouseMove = (event: any) => {
      eventProvider.trigger(EVENTS.MOUSEMOVE, event)
    }
    let handleKeyDown = (event: any) => {
      eventProvider.trigger(EVENTS.KEYDOWN, event);
      switch (event.code) {
        case "KeyW":
          eventProvider.trigger(EVENTS.KEY_W, event, true);
          break;
        case "KeyA":
          eventProvider.trigger(EVENTS.KEY_A, event, true);
          break;
        case "KeyS":
          eventProvider.trigger(EVENTS.KEY_S, event, true);
          break;
        case "KeyD":
          eventProvider.trigger(EVENTS.KEY_D, event, true);
          break;
        case "ArrowUp":
          eventProvider.trigger(EVENTS.KEY_UP, event, true);
          break;
        case "ArrowDown":
          eventProvider.trigger(EVENTS.KEY_DOWN, event, true);
          break;
        case "ArrowLeft":
          eventProvider.trigger(EVENTS.KEY_LEFT, event, true);
          break;
        case "ArrowRight":
          eventProvider.trigger(EVENTS.KEY_RIGHT, event, true);
          break;
        default:
          break
      }
    }

    let handleKeyUp = (event: any) => {
      eventProvider.trigger(EVENTS.KEYUP, event);
      switch (event.code) {
        case "KeyW":
          eventProvider.trigger(EVENTS.KEY_W, event, false);
          break;
        case "KeyA":
          eventProvider.trigger(EVENTS.KEY_A, event, false);
          break;
        case "KeyS":
          eventProvider.trigger(EVENTS.KEY_S, event, false);
          break;
        case "KeyD":
          eventProvider.trigger(EVENTS.KEY_D, event, false);
          break;
        case "ArrowUp":
          eventProvider.trigger(EVENTS.KEY_UP, event, false);
          break;
        case "ArrowDown":
          eventProvider.trigger(EVENTS.KEY_DOWN, event, false);
          break;
        case "ArrowLeft":
          eventProvider.trigger(EVENTS.KEY_LEFT, event, false);
          break;
        case "ArrowRight":
          eventProvider.trigger(EVENTS.KEY_RIGHT, event, false);
          break;
        default:
          break
      }
    }

    ref?.focus?.();
    ref?.addEventListener('click', handleClick);
    ref?.addEventListener('mousemove', handleMouseMove);
    ref?.addEventListener('keydown', handleKeyDown);
    ref?.addEventListener('keyup', handleKeyUp);

    return () => {
      ref?.removeEventListener('click', handleClick);
      ref?.removeEventListener('mousemove', handleMouseMove);
      ref?.removeEventListener('keydown', handleKeyDown);
      ref?.removeEventListener('keyup', handleKeyUp);
    }
  }, [])

  React.useEffect(() => {
    let animFrame: any;
    const { eventProvider, rendererRef } = gameContextValue.current;

    const draw = () => {
      eventProvider.trigger(EVENTS.UPDATE, null);
      rendererRef.current.commit();

      animFrame = requestAnimationFrame(draw);
    };
    animFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrame);
    }
  }, []);

  return <GameContext.Provider value={gameContextValue.current}>{props.children}</GameContext.Provider>
}