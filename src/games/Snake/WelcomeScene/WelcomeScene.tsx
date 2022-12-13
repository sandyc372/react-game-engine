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
  const [btnPos] = React.useState([GRID_SIZE / 2, GRID_SIZE / 2]);

  const doHandleNewGame = React.useCallback(() => {
    handleNewGame('gameplay-scene')
  }, [handleNewGame])
  
  return <canvaslayer>
    <Button
      content='Start new game'
      position={btnPos}
      onClick={doHandleNewGame}
    />
  </canvaslayer>
})