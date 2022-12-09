import React from 'react';
import GameContext from '../../Main/GameContext';
import { Scene as GameplayScene } from './Scene/Scene';
import { WelcomeScene } from './WelcomeScene/WelcomeScene';

export interface ISceneManagerProps { }
const SceneMap: any = {
  'gameplay-scene': GameplayScene,
  'welcome-scene': WelcomeScene
}

export const SceneManager = (props: ISceneManagerProps) => {
  const [isReady, setReady] = React.useState(true);
  const [activeScene, setActiveScene] = React.useState('welcome-scene');

  const Scene = SceneMap[activeScene];
  const sceneProps = activeScene === 'welcome-scene' ? {
    handleNewGame: setActiveScene
  } : {};


  return isReady ? <Scene {...sceneProps} /> : <canvaslayer><canvastext content="Loading scene..." point={[20, 20]} /></canvaslayer>
}