import React, { Component} from "react";
import Game from "../components/game"

class GameScreen extends Component{
  render(){
    return(
      <div className="App">
        
        {/* UI
            CHOICE TEXT
            OVERLAY
            GAME
            TEXT
            End Screen 
            Score
        */}
        <Game/>
      </div>
    );
  }
}

export default GameScreen;