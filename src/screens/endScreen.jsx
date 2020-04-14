import React, { Component } from "react";
import { Flex } from "rebass";
import { Redirect } from "react-router-dom";
import { MenuButton, CardButton } from "../components/UI";
import { Title, BodyText } from "../components/Text";
import FigureIcon from "../components/icon/figure";
import { backgroundColor } from "styled-system";

class EndScreen extends Component {




  constructor(props) {
    super(props);

    const gameData = this.props.history?.location?.state;
    const cards = gameData?.cards ?? [];
    const stayedHome = gameData?.stayedHome ?? false;

    this.state = {
      cards: cards,
      returnToGame: false,
      stayedHome: stayedHome
    };
    this.textOut = ["Because you chose not to stay home, {{infected}} people in your community caught the shadowpox virus from you.", "{{hospital}} of these needed hospital care."];

    this.textZero = ["Congratulations!", "Because you stayed at home, no one in your community caught the shadowpox virus from you, and no one needed hospital care."];

  }

  render() {
    const { cards, stayedHome } = this.state;
    const infected = cards?.length ?? 0;
    
    return (
      <Flex className="App" flexDirection="column" alignItems='center' justifyContent="center" >
        <Flex flexDirection='column' width='fit-content'>
          {this.text()}
          <Flex mx={4} my={4} flexDirection='column' alignItems='center' >
            <form encType="application/x-www-form-urlencoded" action="https://shadowpox.org/cards/" method="POST">
              <input hidden name="cards" type="text" size="32" readOnly={true} value={cards} />
              {/* <input hidden name="stayedhome" type="checkbox" readOnly={true} value='yes' checked={stayedHome} /> */}
              <MenuButton my='2' width={'fit-content'} type='submit' fontSize={[1, 2, 3]}>{`View your ${infected==0 ? 'Protection' : 'Infection'} Collection`}</MenuButton>
            </form>
            <MenuButton width='fit-content' fontSize={[1, 2, 3]} onClick={() => { this.OnReturn() }}>Try Again</MenuButton>
          </Flex>
        </Flex>
        {this.RedirectToPlay()}
      </Flex>
    );
  }

  RedirectToPlay() {
    const { returnToGame } = this.state;

    return returnToGame ? <Redirect to="/" /> : null;
  }

  cardButtons() {
    const { cards } = this.state;

    return (
      cards.map(card => {
        return <CardButton key={`card_${card}`} bg={card > 0 ? 'white' : 'grey'}><span><FigureIcon /></span></CardButton>
      })
    );
  }

  OnReturn() {
    this.setState({ returnToGame: true });
  }


  text() {
    const { cards, stayedHome } = this.state;
    const sick = cards?.length;
    const hospital = cards.filter(c => c < 0).length ?? 0;
    const text = sick == 0 ? this.textZero : this.textOut;
    return (
      <Flex flexDirection="column" alignItems="center" p={3} maxWidth='650px' textAlign='center' flex="1 1 auto" justifyContent='center'>

        {text.map((v, id) => {
          return <BodyText key={id} fontSize={[3, 4, 5]}>{this.stringTemplateParser(v, { infected: sick, hospital: hospital })}</BodyText>
        })}
      </Flex>
    );
  }

  stringTemplateParser(expression, valueObj) {
    const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
    let text = expression.replace(templateMatcher, (substring, value, index) => {
      value = valueObj[value];
      return value;
    });
    return text
  }

}

export default EndScreen;