import React from 'react';
import { Grid } from '../../../Main/Grid';
import { observer } from 'mobx-react-lite';
import { Button } from './Button';
import { GRID_SIZE, WIDTH, HEIGHT } from '../../../Main/Game';

export interface IWelcomeSceneProps {
  handleNewGame: any
}

export const WelcomeScene = observer((props: IWelcomeSceneProps) => {
  const { handleNewGame } = props;
  const [btnPos] = React.useState([25, 25]);

  const doHandleNewGame = React.useCallback(() => {
    handleNewGame('gameplay-scene')
  }, [handleNewGame])
  
  return <canvaslayer>
    {/* <Grid
      startX={0}
      startY={0}
      gridSize={GRID_SIZE}
      height={HEIGHT}
      width={WIDTH}
    /> */}
    <Button
      content='Start new game'
      position={btnPos}
      onClick={doHandleNewGame}
    />
  </canvaslayer>
})