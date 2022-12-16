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
import { SceneController } from './SceneController';
import { EVENTS } from '../../../Main/EventProvider';
import { Position } from '../../../ECS/Components/Position';
import { Score } from './Components/Score';

export const Scene = observer((props: any) => {
  const gameContext = React.useContext(GameContext);
  const { ecs, eventProvider } = gameContext;
  const cntroller = React.useRef<SceneController>(new SceneController());

  React.useEffect(() => {
    // set up the entities
    runInAction(() => {
      const initialSnakeLocation = translateMatrix(
        [10, 10],
        Array.from(Array(10), (el, i) => ([0, i]))
      );
      const initialFoodLocation = cntroller.current.calculateFoodLocation(initialSnakeLocation, GRID_SIZE)!
      ecs.entityMap.set('scene2', new Map());

      const sceneEntities = ecs.entityMap.get('scene2')

      const snakeEntity = new Entity('snake', 'snake');
      snakeEntity.components.set('appearance', new Appearance(initialSnakeLocation))
      snakeEntity.components.set('length', new Length(10));
      snakeEntity.components.set('direction', new Direction('up'))
      snakeEntity.components.set('health', new Health(5));
      snakeEntity.components.set('score', new Score(0));

      const foodEntity = new Entity('food', 'food');
      foodEntity.components.set('position', new Position(initialFoodLocation[0], initialFoodLocation[1]));

      sceneEntities?.set(snakeEntity.name, snakeEntity);
      sceneEntities?.set(foodEntity.name, foodEntity);
    })
  }, []);

  React.useLayoutEffect(() => {
    const update = () => {
      const sceneEntities = ecs.entityMap.get('scene2');
      cntroller.current.update(sceneEntities, GRID_SIZE)
    }
    eventProvider.on(EVENTS.UPDATE, update);
    return () => eventProvider.off(EVENTS.UPDATE, update);
  }, [])

  const turnSnake = React.useCallback(() => {
    const sceneEntities = ecs.entityMap.get('scene2');
    const snakeEntity = sceneEntities?.get('snake');
    cntroller.current.moveSnake(snakeEntity, GRID_SIZE)
  }, [])

  return <canvaslayer>
    <PlayArea
      startX={0}
      startY={50}
      width={WIDTH}
      height={HEIGHT - 50}
      gridSize={GRID_SIZE}
      turnSnake={turnSnake}
    />
    <PlayerInfo
      startX={0}
      startY={0}
      width={WIDTH}
      height={50}
    />
  </canvaslayer>
})