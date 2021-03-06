import React, { Component } from "react";
import { Flex } from "rebass";
import { Redirect } from "react-router-dom";
import { ShortText } from "../components/Text";
import { CircleButton } from "../components/UI";
import OutIcon from "../components/icon/leave_icon";
import StayIcon from "../components/icon/stay_icon";
class IntroScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            goToGame: false,
            stay: false,
        };
    }

    render() {
        return (
            <Flex className="App"
                flexDirection='column'
                alignItems='center'
                height='100%'
                justifyContent='center'
                >
                <Flex flexDirection='column' width='fit-content'>
                <Flex
                    flexDirection='column'
                    alignItems='center'
                    mb={4}>
                    <ShortText m={2} fontSize={[ 3, 4]}>There’s a new virus in town.</ShortText>
                    <ShortText m={2} fontSize={[3, 4]}>{'Shadowpox is highly contagious.\n1 in 5 of those infected will become very sick.\nSome will die. '}</ShortText>
                    <ShortText m={2} fontSize={[ 3, 4]}>Without knowing it, you might be a carrier.</ShortText>
                    <ShortText m={2} fontSize={[ 3, 4]}>{'Will you #StayHome to save lives?'} </ShortText>
                </Flex>
                <Flex m={3} justifyContent='space-evenly'>
                    <Flex
                        flexDirection='column'>
                        <CircleButton m={2} onClick={() => { this.onClick(true) }}>
                            <StayIcon />
                        </CircleButton>
                        <ShortText fontWeight='bold'>Stay Home</ShortText>
                    </Flex>
                    <Flex
                        flexDirection='column'>
                        <CircleButton m={2} onClick={() => { this.onClick(false) }}>
                            <OutIcon />
                        </CircleButton>
                        <ShortText fontWeight='bold'>Go Out</ShortText>
                    </Flex>
                </Flex>
                </Flex>
                {this.RedirectToGameScreen()}
            </Flex>
        );
    }

    onClick(isStaying) {
        this.setState({ goToGame: true, stay: isStaying });
    }

    RedirectToGameScreen() {
        const { goToGame, stay } = this.state;
        return goToGame ? <Redirect to={{ pathname: "/game", state: { stayed: stay } }} /> : null;
    }
}

export default IntroScreen;