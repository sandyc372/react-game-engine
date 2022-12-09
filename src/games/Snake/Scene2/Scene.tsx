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


export const Scene = observer((props: any) => {
  const gameContext = React.useContext(GameContext);
  const { ecs, eventProvider } = gameContext;
  const sceneEntities = ecs.entityMap.get('scene2');
  const snakeEntity = sceneEntities?.get('snake');

  React.useEffect(() => {
    // set up the entities
    runInAction(() => {
      ecs.entityMap.set('scene2', new Map());

      const sceneEntities = ecs.entityMap.get('scene2')

      const snakeEntity = new Entity('snake', 'snake');
      snakeEntity.components.set('appearance', new Appearance(
        translateMatrix([10, 10], [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]])
      ))
      snakeEntity.components.set('length', new Length(8));
      snakeEntity.components.set('direction', new Direction('up'))

      sceneEntities?.set(snakeEntity.name, snakeEntity);
    })
  }, [])

  return <canvaslayer>
    <Grid />
    <Snake entity={snakeEntity} />
  </canvaslayer>
})