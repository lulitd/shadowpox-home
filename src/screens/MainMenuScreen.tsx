import React, { Component } from "react";
import { Title, BodyText } from "../components/Text";
import { Modal, MenuButton } from "../components/UI";
import { Box, Heading } from "rebass";
import { Redirect } from "react-router-dom";

enum MenuModalDisplay {
  none,
  options,
  about,
}

class MainMenuScreen extends Component {

  state = {
    modalDisplay: MenuModalDisplay.none,
    isPlaying: false,
  }

  menuButtons = [
    { title: 'Play', isPlayer: true, isVisible: true },
    { title: 'About', modal: MenuModalDisplay.about, isVisible: false },
    { title: 'Options', modal: MenuModalDisplay.options, isVisible: false }
  ];

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box className="App"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box sx={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: "100%",
          justifyContent: 'center'
        }} >
          <Title
            fontSize={[6, 6, 7]}
            fontWeight='bold'
            color='text'>
            {'Shadowpox: \n Stay Home'}
          </Title>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: "400px"
        }} m={[2, 3]} mb={4}>
          {this.MenuButtons()}
        </Box>
        {this.RedirectToPlay()}
      </Box>
    );
  }

  MenuButtons() {
    return (this.menuButtons.map(btn => {

      if (!btn.isVisible) return null;

      let btnFunct;
        if (btn.isPlayer) {
          btnFunct = () => { this.OnPlay(); }
        }
        else {
          btnFunct = () => { this.showModal(btn.modal ?? MenuModalDisplay.none); }
        }
      return (
        <MenuButton variant='outline'
          key={btn.title}
          width="100%"
          p={2} my={2}
          fontSize={[3, 4, 5]}
          onClick={btnFunct}>
          {btn.title}
        </MenuButton>
      );
    }));
  }

  AboutModal() {
    return <Modal onClose={() => this.showModal(MenuModalDisplay.none)} show={this.state.modalDisplay === MenuModalDisplay.about} title="About" >
      <BodyText p={2}>1 Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, consequuntur. Molestiae modi corporis rem dolorem distinctio vitae natus corrupti fugiat. Atque labore enim sed nobis facere doloribus ullam voluptates soluta.</BodyText>
      <BodyText p={2}>2 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil velit cupiditate eaque animi, dolore quam perferendis illo? Reiciendis necessitatibus veniam, exercitationem, quis dignissimos mollitia pariatur cum quidem ratione, praesentium veritatis.</BodyText>
      <BodyText p={2}>3 Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, consequuntur. Molestiae modi corporis rem dolorem distinctio vitae natus corrupti fugiat. Atque labore enim sed nobis facere doloribus ullam voluptates soluta.</BodyText>
      <BodyText p={2}>4 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil velit cupiditate eaque animi, dolore quam perferendis illo? Reiciendis necessitatibus veniam, exercitationem, quis dignissimos mollitia pariatur cum quidem ratione, praesentium veritatis.</BodyText>
      <BodyText p={2}>5 Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, consequuntur. Molestiae modi corporis rem dolorem distinctio vitae natus corrupti fugiat. Atque labore enim sed nobis facere doloribus ullam voluptates soluta.</BodyText>
      <BodyText p={2}>6 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil BodyTextndis necessitatibus veniam, exercitationem, quis dignissimos mollitia pariatur cum quidem ratione, praesentium veritatis.</BodyText>
      <BodyText p={2}>7 Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, consequuntur. Molestiae modi corporis rem dolorem distinctio vitae natus corrupti fugiat. Atque labore enim sed nobis facere doloribus ullam voluptates soluta.</BodyText>
      <BodyText p={2}>8 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil velit cupiditate eaque animi, dolore quam perferendis illo? Reiciendis necessitatibus veniam, exercitationem, quis dignissimos mollitia pariatur cum quidem ratione, praesentium veritatis.</BodyText>
    </Modal>
  }

  OptionsModal() {
    return <Modal onClose={() => this.showModal(MenuModalDisplay.none)} show={this.state.modalDisplay === MenuModalDisplay.options} title="Options" />
  }

  showModal(modalToDisplay: MenuModalDisplay) {
    this.setState({
      modalDisplay: modalToDisplay
    });
  }

  RedirectToPlay() {
    const { isPlaying } = this.state;

    return isPlaying ? <Redirect to="/intro" /> : null;
  }

  OnPlay() {
    this.setState({
      modalDisplay: MenuModalDisplay.none,
      isPlaying: true,
    });

  }
}

export default MainMenuScreen;