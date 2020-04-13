import React, { Component } from "react";
import GameComponent from "../components/gameComponent"
import { Box, Flex } from "rebass";
import Listener from "../phaser/Listener";
import { GAME_EVENTS } from "../phaser/data/const";
import { gConfigGeneral } from '../phaser/data/gameConfig'
import { Redirect } from "react-router-dom";
import { ShortText } from "../components/Text";
import { backgroundColor } from "styled-system";
class GameScreen extends Component {

  constructor(props) {
    super(props);
    
    const gameData = this.props.history?.location?.state;
    const stayedHome = gameData?.stayed ?? false;

    this.state = {
      stayedHome: stayedHome,
      timeRemaining: gConfigGeneral.gameLength, /// in seconds eg. 90= 1 min 30 secs
      score: 0,
      isPlaying: true,
      infected: [],
    };
  }


  componentDidMount() {
    if (window.phaserEvents === undefined) {
      window.phaserEvents = new Listener();
    }

    window.phaserEvents.addListener(
      GAME_EVENTS.ON_INFECTED,
      score => this.setScore(score)
    );

    window.phaserEvents.addListener(
      GAME_EVENTS.ON_ROUND_END,
      (infected) => this.roundFinished(infected)
    );

    window.phaserEvents.addListener(
      GAME_EVENTS.ON_TIMER,
      time => this.setTime(time)
    );
  }

  componentWillUnmount() {
    if (window.phaserEvents) {
      // window.phaserEvents.removeListener(
      //   GAME_EVENTS.ON_INFECTED,
      //   score => this.setScore(score)
      // );

      // window.phaserEvents.removeListener(
      //   GAME_EVENTS.ON_ROUND_END,
      //   () => this.roundFinished()
      // );

      // window.phaserEvents.removeListener(
      //   GAME_EVENTS.ON_TIMER,
      //   time => this.setTime(time)
      // );
      window.phaserEvents.removeAllListeners();
    }
  }

  render() {
    const {stayedHome}= this.state; 
    return (
      <Flex className="App" flexDirection='column' alignItems='center' sx={{ height: '100%' }}>
        <Box sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
          <GameComponent stayed={stayedHome}/>
        </Box>

        <Flex
          px={4}
          py={2}
          color='black'
          alignItems='center'
          sx={{ position: "absolute", top: 0, width: '100%', maxWidth: "500px" }}
        >

          {this.ShowTimer()}
          <Box mx='auto' />
          {this.ShowScore()}
        </Flex>
        {this.RedirectToEndScreen()}
      </Flex>
    );
  }

  setScore(score) {
    this.setState({
      score: score
    });
  }

  roundFinished(infected) {
    this.setState({
      isPlaying: false,
      infected: infected,
    });
  }

  setTime(time) {
    this.setState({
      timeRemaining: time
    });
  }

  ShowTimer() {
    const { timeRemaining } = this.state;

    const min = Math.floor(timeRemaining / 60);
    let sec = timeRemaining % 60;
    sec = (sec < 10 ? '0' : '') + sec;
    const label = `${min}:${sec}`;
    return <ShortText color="black"fontWeight="bold" fontSize={[3,4,5]}>{label}</ShortText>
  }
  ShowScore() {
    const { score } = this.state;
    const label = `${score}`;
    return <ShortText color="black"fontWeight="bold" fontSize={[3,4,5]}>{label}</ShortText>
  }


  RedirectToEndScreen() {
    const { isPlaying, infected,stayedHome } = this.state;

    return isPlaying ? null : <Redirect to={{ pathname: "/score", state: { cards: infected, stayedHome:stayedHome} }} />;
  }
}

export default GameScreen;