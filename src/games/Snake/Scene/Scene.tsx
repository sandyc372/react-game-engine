import React from 'react';
import { Grid } from '../../../Main/Grid';
import GameContext from '../../../Main/GameContext';
import { Entity } from '../../../ECS/Entity';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { Appearance } from '../../../ECS/Components/Appearance';
import { Snake } from './Snake';
import { Length } from './Components/Length';
import { Direction } from './Components/Direction';
import { translateMatrix } from '../../../Main/utils';
import { PlayArea } from './PlayArea';
import { GRID_SIZE, WIDTH, HEIGHT } from '../../../Main/Game';
import { PlayerInfo } from './PlayerInfo';
import { Health } from './Components/Health';

export const Scene = observer((props: any) => {
  const gameContext = React.useContext(GameContext);
  const { ecs, eventProvider } = gameContext;
  const sceneEntities = ecs.entityMap.get('scene2');

  React.useEffect(() => {
    // set up the entities
    runInAction(() => {
      ecs.entityMap.set('scene2', new Map());

      const sceneEntities = ecs.entityMap.get('scene2')

      const snakeEntity = new Entity('snake', 'snake');
      snakeEntity.components.set('appearance', new Appearance(
        translateMatrix(
          [10, 10],
          Array.from(Array(20), (el, i) => ([0, i]))
        )
      ))
      snakeEntity.components.set('length', new Length(8));
      snakeEntity.components.set('direction', new Direction('up'))
      snakeEntity.components.set('health', new Health(100))

      sceneEntities?.set(snakeEntity.name, snakeEntity);
    })
  }, [])

  return <canvaslayer>
    <PlayArea
      startX={0}
      startY={50}
      width={WIDTH}
      height={HEIGHT - 50}
      gridSize={GRID_SIZE}
    />
    <PlayerInfo
      startX={0}
      startY={0}
      width={WIDTH}
      height={50}
    />
  </canvaslayer>
})