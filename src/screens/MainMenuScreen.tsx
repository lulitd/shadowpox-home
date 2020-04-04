import React, { Component } from "react";
import Title from "../components/Title";
import MenuButton from "../components/menuButton";
import Modal from "../components/modal";
import { Box, Heading, Text } from "rebass";
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
        }} m={[2, 3]}>
          <MenuButton variant='outline' width="100%" p={2} my={2} fontSize={[3, 4, 5]} onClick={() => {
            this.setState({
              modalDisplay: MenuModalDisplay.none,
              isPlaying: true
            });
          }}>Play</MenuButton>
          <MenuButton variant='outline' width="100%" p={2} my={2} fontSize={[3, 4, 5]} onClick={e => { this.showModal(MenuModalDisplay.options); }}>Options</MenuButton>
          <MenuButton variant='outline' width="100%" p={2} my={2} fontSize={[3, 4, 5]} onClick={e => { this.showModal(MenuModalDisplay.about); }}>About</MenuButton>
        </Box>
        <Modal onClose={() => this.showModal(MenuModalDisplay.none)} show={this.state.modalDisplay === MenuModalDisplay.about} title="About" >
          <Text p={2}>1 Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, consequuntur. Molestiae modi corporis rem dolorem distinctio vitae natus corrupti fugiat. Atque labore enim sed nobis facere doloribus ullam voluptates soluta.</Text>
          <Text p={2}>2 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil velit cupiditate eaque animi, dolore quam perferendis illo? Reiciendis necessitatibus veniam, exercitationem, quis dignissimos mollitia pariatur cum quidem ratione, praesentium veritatis.</Text>
          <Text p={2}>3 Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, consequuntur. Molestiae modi corporis rem dolorem distinctio vitae natus corrupti fugiat. Atque labore enim sed nobis facere doloribus ullam voluptates soluta.</Text>
          <Text p={2}>4 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil velit cupiditate eaque animi, dolore quam perferendis illo? Reiciendis necessitatibus veniam, exercitationem, quis dignissimos mollitia pariatur cum quidem ratione, praesentium veritatis.</Text>
          <Text p={2}>5 Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, consequuntur. Molestiae modi corporis rem dolorem distinctio vitae natus corrupti fugiat. Atque labore enim sed nobis facere doloribus ullam voluptates soluta.</Text>
          <Text p={2}>6 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil velit cupiditate eaque animi, dolore quam perferendis illo? Reiciendis necessitatibus veniam, exercitationem, quis dignissimos mollitia pariatur cum quidem ratione, praesentium veritatis.</Text>
          <Text p={2}>7 Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, consequuntur. Molestiae modi corporis rem dolorem distinctio vitae natus corrupti fugiat. Atque labore enim sed nobis facere doloribus ullam voluptates soluta.</Text>
          <Text p={2}>8 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil velit cupiditate eaque animi, dolore quam perferendis illo? Reiciendis necessitatibus veniam, exercitationem, quis dignissimos mollitia pariatur cum quidem ratione, praesentium veritatis.</Text>
        </Modal>
        <Modal onClose={() => this.showModal(MenuModalDisplay.none)} show={this.state.modalDisplay === MenuModalDisplay.options} title="Options" />
        {this.RedirectToPlay()}
      </Box>
    );
  }

  showModal(modalToDisplay: MenuModalDisplay) {

    this.setState({
      modalDisplay: modalToDisplay
    });

  }

  RedirectToPlay() {
    const { isPlaying } = this.state;

    return isPlaying ? <Redirect to="/game" /> : null;
  }

  onPlay() {


  }
}

export default MainMenuScreen;