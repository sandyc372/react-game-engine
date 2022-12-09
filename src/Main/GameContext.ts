import React from 'react';
import { EventProvider } from './EventProvider';
import { ECS } from '../ECS/ECS';

const GameContext = React.createContext<{
  eventProvider: EventProvider,
  canvasRef: any,
  rendererRef: any,
  ecs: ECS,
  assets: Map<string, any>
}>({
  eventProvider: new EventProvider(),
  canvasRef: {},
  rendererRef: {},
  ecs: new ECS(),
  assets: new Map()
})

export default GameContext;