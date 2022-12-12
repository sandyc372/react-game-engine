import React from 'react';
import { Grid } from '../../../Main/Grid';
import { calculatePath } from '../../../Main/pathing';
import GameContext from '../../../Main/GameContext';
import { EVENTS } from '../../../Main/EventProvider';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Entity } from '../../../ECS/Entity';
import { Position } from '../../../ECS/Components/Position';
import { Path as PathComponent } from '../../../ECS/Components/Path';
import { observer } from 'mobx-react-lite';
import { Path } from '../../../Main/Path';
import { runInAction } from 'mobx';
import { Appearance } from '../../../ECS/Components/Appearance';

let lastMoved: number;

export const Scene = observer((props: any) => {
  const gameContext = React.useContext(GameContext);
  const { ecs, eventProvider } = gameContext;
  const sceneEntities = ecs.entityMap.get('scene1');
  const playerEntity = sceneEntities?.get('player');
  const enemyEntity = sceneEntities?.get('enemy');
  const { x: playerX, y: playerY } = playerEntity?.components.get('position') ?? {}
  const { x: enemyX, y: enemyY } = enemyEntity?.components.get('position') ?? {}

  React.useEffect(() => {
    // set up the entities
    runInAction(() => {
      ecs.entityMap.set('scene1', new Map());

      const sceneEntities = ecs.entityMap.get('scene1')

      const playerEntity = new Entity('player', 'player');
      playerEntity.components.set('position', new Position(20, 17))
      playerEntity.components.set('appearance', new Appearance([[0, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]))

      const enemyEntity = new Entity('enemy', 'enemy');
      enemyEntity.components.set('position', new Position(10, 10));
      enemyEntity.components.set('path', new PathComponent())

      sceneEntities?.set(playerEntity.name, playerEntity);
      sceneEntities?.set(enemyEntity.name, enemyEntity);
    })
  }, [])

  React.useEffect(() => {
    const move = (arg: any) => {
      const sceneEntities = ecs.entityMap.get('scene1');
      const enemyEntity = sceneEntities?.get('enemy');

      if (Date.now() - lastMoved < 500) {
        return
      }
      lastMoved = Date.now();
      const enmyPath = enemyEntity?.components.get('path');
      const enmyPostn = enemyEntity?.components.get('position');
      runInAction(() => {
        if (enmyPath?.indexInPath > 0) {
          enmyPath.indexInPath = enmyPath.indexInPath - 1;
          enmyPostn.x = enmyPath.points[enmyPath.indexInPath][0];
          enmyPostn.y = enmyPath.points[enmyPath.indexInPath][1];
        }
      })
    }
    eventProvider.on(EVENTS.UPDATE, move);
    return () => eventProvider.off(EVENTS.UPDATE, move);
  }, [])

  React.useLayoutEffect(() => {
    if (!enemyEntity) {
      return
    }
    const enmyPath = enemyEntity.components.get('path')!;
    const enmyPostn = enemyEntity?.components.get('position');
    runInAction(() => {
      const path = calculatePath([enemyX, enemyY], [playerX, playerY]);
      enmyPath.points = path;
      enmyPath.indexInPath = path.length - 1;
      if (enmyPath?.indexInPath > 0) {
        enmyPostn.x = enmyPath.points[enmyPath.indexInPath][0];
        enmyPostn.y = enmyPath.points[enmyPath.indexInPath][1];
      }
    })
  }, [playerX, playerY, enemyEntity])

  return <canvaslayer>
    {/* <Grid /> */}
    {/*  <Path pathSegments={path} indexInPath={indexInPath} /> */}
    {/* <Enemy entity={enemyEntity} />
    <Player entity={playerEntity} /> */}
  </canvaslayer>
})