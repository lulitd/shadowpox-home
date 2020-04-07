import React, { Component } from "react";
import { Flex, Text } from "rebass";
import axios from 'axios';
import qs from 'qs';
import { MenuButton, CardButton } from "../components/UI";
import { Title, BodyText } from "../components/Text";
import FigureIcon from "../components/figure";

class EndScreen extends Component {

  constructor(props) {
    super(props);

    const gameData = this.props.history?.location?.state;
    const cards = gameData?.cards || [-1, 3, 5, -2, 4, -1, 3, 5, -2, 4, -1, 3, 5, -2, 4, -1, 3, 5, -2, 4];
    const stayedHome = gameData?.statedHome || 'no';
    this.state = {
      cards: cards,
      stayedHome: stayedHome
    };

  }
  render() {
    const { cards } = this.state;
    const deaths = cards.filter(c => c < 0);

    return (
      <Flex className="App" flexDirection="column" alignItems='center' >
        <Flex flexDirection="column" alignItems="center" p={3} maxWidth='650px' textAlign='center'>
          <Title mb={2} fontSize={[4, 5,6]}>{`Infection Score:\n${cards.length}`}</Title>
          <BodyText fontSize={[3,4, 5]}>Because you chose not to stay home, these {cards.length} people in your community caught the virus from you.</BodyText>
          <BodyText fontSize={[3,4, 5]}>{deaths.length} of these have died from the disease.</BodyText>
          <MenuButton mt={4} onClick={this.handleSubmit()}>Click to learn their stories </MenuButton>
        </Flex>
        <Flex p={3} flexWrap='wrap' justifyContent='center' maxWidth='650px'>
          {this.cardButtons()}
        </Flex>
      </Flex>
    );
  }

  cardButtons() {
    const { cards } = this.state;

    return (
      cards.map(card => {

        return <CardButton key={`card_${card}`}bg={card > 0 ? 'white' : 'grey'} onClick={this.handleSubmit()}><span><FigureIcon/></span></CardButton>
      })
    );
  }

  handleSubmit() {
    const data = this.state;
    const url = 'https://shadowpox.org/cards/';

    const options = {
      method: 'POST',
      headers: { 'Access-Control-Allow-Origin': '*' },
      data: qs.stringify(data),
      url,
    };

    axios(options).then(function (response) {
      console.log('response is : ' + response.data);
    }).catch(function (error) {
      console.log(error);
    });

  }
}

export default EndScreen;