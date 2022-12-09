import React from 'react';
import { Grid } from '../../../Main/Grid';
import { observer } from 'mobx-react-lite';
import { Button } from './Button';

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
    <Grid />
    <Button
      content='Start new game'
      position={btnPos}
      onClick={doHandleNewGame}
    />
  </canvaslayer>
})