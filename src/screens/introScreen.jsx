import React, { Component } from "react";
import { Text, Flex } from "rebass";
import { Redirect } from "react-router-dom";
import { MenuButton } from "../components/UI";
import { ShortText } from "../components/Text";
class IntroScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            goToGame: false
        };
    }

    render() {
        return (
            <Flex className="App"
                flexDirection='column'
                alignItems='center'
                height='100%'>
                <Flex
                    flexDirection='column'
                    flex='1 1 auto'
                    justifyContent='center'
                    alignItems='center'
                    width='100%' >
                    <ShortText my={2} fontSize={[2,3,4]}>There’s a new virus in town.</ShortText>
                    <ShortText  my={2} fontSize={[2,3,4]}>{'It’s highly contagious.\n You might be infected with no symptoms.'}</ShortText>
                    <ShortText  my={2} fontSize={[2,3,4]}>Will you #StayHomeSaveLives?</ShortText>
                    <ShortText  my={2} fontSize={[2,3,4]}>{'You choose…\nfor you\nand 99 other people.'} </ShortText>
                    <ShortText  my={2} fontSize={[2,3,4]}>Let’s play!</ShortText>
                </Flex>
                <Flex pb={3,4,5}>
                <MenuButton m={2} onClick={() => { this.onClick() }}>Continue</MenuButton>
                </Flex>
                {this.RedirectToGameScreen()}
            </Flex>
        );
    }

    onClick() {
        this.setState({ goToGame: true });
    }

    RedirectToGameScreen() {
        const { goToGame } = this.state;
        return goToGame ? <Redirect to="/game" /> : null;
    }
}

export default IntroScreen;