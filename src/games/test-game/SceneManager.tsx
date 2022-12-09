import React from 'react';
import GameContext from '../../Main/GameContext';
import { Scene } from './Scene/Scene';

export interface ISceneManagerProps { }

export const SceneManager = (props: ISceneManagerProps) => {
  const [isReady, setReady] = React.useState(true);
  const gameContext = React.useContext(GameContext);
  return isReady ? <Scene /> : <canvaslayer><canvastext content="Loading scene..." point={[20, 20]} /></canvaslayer>
}