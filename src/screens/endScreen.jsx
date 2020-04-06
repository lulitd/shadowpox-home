import React, { Component } from "react";
import { Button } from "rebass";
import axios from 'axios';
import qs from 'qs';


class EndScreen extends Component {

  constructor(props) {
    super(props);

    const gameData = this.props.history?.location?.state; 
    const cards = gameData?.cards||[]; 
    const stayedHome = gameData?.statedHome||'no'; 
    this.state={
      cards:cards,
      stayedHome:stayedHome
    };

  }
  render() {
    return (
      <div className="App">
        <form action="https://shadowpox.org/cards/" method="POST">
          <input name="cards" type="text" size="32" className="inputbox" value={this.state.cards} /><br />
          <input name="stayedhome" type="checkbox" value={this.state.stayedHome} />
          <label for="stayedhome">Stayed home</label><br />
          <input name="Send" type="submit" />
        </form>
        {/* <Button onClick={this.handleSubmit}>Click to view cards</Button> */}
      </div>
    );
  }

  handleSubmit() {
    const data = { cards: '-12,3,4,5', stayedhome: 'yes' };
    const url = 'https://shadowpox.org/cards/';

    // const options = {
    //   method: 'POST',
    //   headers: {'Access-Control-Allow-Origin': '*' },
    //   data: qs.stringify(data),
    //   url,
    // };

    // axios(options).then(function (response) {
    //   console.log('response is : ' + response.data);
    // }).catch(function (error) {
    //   console.log(error);
    // });
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      // update the state of the component with the result here
      console.log(xhr.responseText)
    })

    xhr.addEventListener('error', () => {
      console.log(xhr.responseText)
    })

    xhr.open('POST', url)
    // send the request
    xhr.send(JSON.stringify(data));


  }
}

export default EndScreen;