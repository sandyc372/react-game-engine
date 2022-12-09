import React from 'react';
import { WIDTH, HEIGHT, GRID_SIZE, tileHeight, tileWidth } from '../../../Main/Game';
import GameContext from '../../../Main/GameContext';
import { EVENTS } from '../../../Main/EventProvider';
import { getMousePos, translateMatrix } from '../../../Main/utils';
import { Entity } from '../../../ECS/Entity';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

let lastMoved: number = 0;

export interface IPlayerProps {
  entity?: Entity
}

export const Player = observer((props: IPlayerProps) => {
  const { entity } = props;
  const gameContext = React.useContext(GameContext);
  const pressedKey = React.useRef<any>()
  const { eventProvider, assets } = gameContext;

  React.useLayoutEffect(() => {
    if (!entity) {
      return
    }

    const setKeyState = (key: string, isDown: boolean) => {
      if (isDown) {
        pressedKey.current = key
      } else {
        if (pressedKey.current === key) {
          pressedKey.current = null
        }
      }

    }
    const setUpKeyState = (evt: any, isDown: boolean) => setKeyState('up', isDown)
    const setDownKeyState = (evt: any, isDown: boolean) => setKeyState('down', isDown)
    const setLeftKeyState = (evt: any, isDown: boolean) => setKeyState('left', isDown)
    const setRightKeyState = (evt: any, isDown: boolean) => setKeyState('right', isDown)

    eventProvider.on(EVENTS.KEY_W, setUpKeyState);
    eventProvider.on(EVENTS.KEY_A, setLeftKeyState);
    eventProvider.on(EVENTS.KEY_S, setDownKeyState);
    eventProvider.on(EVENTS.KEY_D, setRightKeyState);

    return () => {
      eventProvider.off(EVENTS.KEY_W, setUpKeyState);
      eventProvider.off(EVENTS.KEY_A, setLeftKeyState);
      eventProvider.off(EVENTS.KEY_S, setDownKeyState);
      eventProvider.off(EVENTS.KEY_D, setRightKeyState);
    }
  }, [entity]);

  React.useLayoutEffect(() => {
    const movePlayer = () => {
      if (!entity) {
        return
      }

      if (Date.now() - lastMoved < 20) {
        return
      }

      const direction = pressedKey.current
      if (!direction) {
        return
      }

      const positionComponent = entity.components.get('position')!;
      const apprComponent = entity.components.get('appearance')!;
      let delta = [
        direction === 'left' ? -1 : direction === 'right' ? 1 : 0,
        direction === 'up' ? -1 : direction === 'down' ? 1 : 0
      ]
      const newPosition = [
        positionComponent.x + delta[0],
        positionComponent.y + delta[1]
      ]
      const matrix = translateMatrix(newPosition, apprComponent.occupancyMatrix);
      if (matrix.every(el => {
        const x = el[0];
        const y = el[1];
        return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE
      })) {
        lastMoved = Date.now();
        runInAction(() => {
          positionComponent.x = newPosition[0];
          positionComponent.y = newPosition[1]
        })
      }
    }

    eventProvider.on(EVENTS.UPDATE, movePlayer);
    return () => eventProvider.off(EVENTS.UPDATE, movePlayer);
  }, [entity])

  if (!entity) {
    return null
  }

  const positionComponent = entity.components.get('position')!;
  // const sprite = assets.get('player_sprite')!;
  const apprComponent = entity.components.get('appearance')!;
  const matrix: any = translateMatrix([positionComponent.x, positionComponent.y], apprComponent.occupancyMatrix);
  
  /* return <canvasimage
    image={sprite}
    sx={3 + 200}
    sy={10}
    sWidth={95}
    sHeight={250}
    dx={(positionComponent.x - 1) * tileWidth}
    dy={(positionComponent.y - 1) * tileHeight}
    dWidth={3 * tileWidth}
    dHeight={6 * tileHeight}
  /> */
  return matrix.map(
    ([x, y]: number[]) => <canvasrect key={x + '' + y} x={x * tileWidth} y={y * tileHeight} width={tileWidth} height={tileHeight} fill={'#707070'} stroke={'transparent'} strokeWeight={1} />
  )
})