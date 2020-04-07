import React, { Component } from "react";
import { Flex } from "rebass";
import { MenuButton, CardButton } from "../components/UI";
import { Title, BodyText } from "../components/Text";
import FigureIcon from "../components/icon/figure";

class EndScreen extends Component {

  constructor(props) {
    super(props);

    const gameData = this.props.history?.location?.state;
    const cards = gameData?.cards || [-2, 3, 5, -16, 7, 10, 24];
    const stayedHome = gameData?.stayedHome||false;

    this.state = {
      cards: cards,
      stayedHome: stayedHome
    };

  }
  render() {
    const { cards, stayedHome } = this.state;
    const deaths = cards.filter(c => c < 0);

    return (
      <Flex className="App" flexDirection="column" alignItems='center' >
        <Flex flexDirection="column" alignItems="center" p={3} maxWidth='650px' textAlign='center' flex="1 1 auto" justifyContent='center'>
          <Title mb={2} fontSize={[4, 5, 6]}>{`Infection Score:\n${cards.length}`}</Title>
          <BodyText fontSize={[3, 4, 5]}>Because you chose not to stay home, these {cards.length} people in your community caught the shadowpox virus from you.</BodyText>
          <BodyText fontSize={[3, 4, 5]}>{deaths.length} of these have died from the disease.</BodyText>
        </Flex>
        <Flex flexDirection='column' mx={4} mb={4}>
          <MenuButton onClick={() => { this.handleSubmit() }}>Try Again</MenuButton>

          <form encType="application/x-www-form-urlencoded" action="https://shadowpox.org/cards/" method="POST">
            <input hidden name="cards" type="text" size="32" readOnly={true}value={cards} />
            <input hidden name="stayedhome" type="checkbox" readOnly={true}value='yes' checked={stayedHome}/>
            <MenuButton type='submit' mb={2}>Click to meet your Infection Collection </MenuButton>
          </form>
        </Flex>
      </Flex>
    );
  }

  cardButtons() {
    const { cards } = this.state;

    return (
      cards.map(card => {
        return <CardButton key={`card_${card}`} bg={card > 0 ? 'white' : 'grey'}><span><FigureIcon /></span></CardButton>
      })
    );
  }
}

export default EndScreen;