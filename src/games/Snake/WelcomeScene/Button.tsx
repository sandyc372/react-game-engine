import { observer } from 'mobx-react-lite';
import React from 'react';
import { EVENTS } from '../../../Main/EventProvider';
import { tileHeight, tileWidth } from '../../../Main/Game';
import GameContext from '../../../Main/GameContext';
import { getMousePos } from '../../../Main/utils';


export interface IButtonProps {
  content: string,
  position: number[],
  onClick: any
}
export const Button = observer((props: IButtonProps) => {
  const { content, position, onClick } = props;
  const gameContext = React.useContext(GameContext);
  const { eventProvider, canvasRef } = gameContext;
  const corners = [
    [position[0] - 6, position[1] - 2],
    [position[0] - 6, position[1] + 2],
    [position[0] + 6, position[1] + 2],
    [position[0] + 6, position[1] - 2]
  ]

  React.useEffect(() => {
    const handleClick = (event: any) => {
      const { x, y } = getMousePos(canvasRef.current, event);
      const xMin = (position[0] - 6) * tileWidth;
      const xMax = (position[0] + 6) * tileWidth;
      const yMin =(position[1] - 2) * tileHeight;
      const yMax = (position[1] + 2) * tileHeight;
      if ((xMin <= x && x <= xMax) && ((yMin <= y && y <= yMax))) {
        onClick()
      }
    }

    eventProvider.on(EVENTS.CLICK, handleClick);
    return () => eventProvider.off(EVENTS.CLICK, handleClick);
  }, [position, onClick])

  return <canvaslayer>
    {
      corners.map((corner, i) => <canvasline
        key={i}
        x1={corner[0] * tileWidth}
        y1={corner[1] * tileHeight}
        x2={corners[(i + 1) % 4][0] * tileWidth}
        y2={corners[(i + 1) % 4][1] * tileHeight}
        strokeWeight={2}
        stroke={'black'}
      />)
    }
    <canvastext
      content={content}
      point={[position[0] * tileWidth, position[1] * tileHeight]}
      textAlign='center'
      textBaseline='middle'
      font='bold 14px monospace'
      maxWidth={12 * tileWidth}
    />
  </canvaslayer>
})