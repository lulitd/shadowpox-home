import React from "react";
import ReactDOM from "react-dom";
import {Switch, Route, MemoryRouter } from 'react-router-dom';
import {ThemeProvider} from "theme-ui";
import theme from './theme';
import GameScreen from "./screens/gameScreen";
import EndScreen from "./screens/endScreen";
import MainMenuScreen from "./screens/MainMenuScreen";
const MainEntry = () => {
    return (
        <ThemeProvider theme={theme}>
        <main>
            <Switch>
                <Route exact path="/" render={() => <MainMenuScreen />} />
                <Route exact path="/game" render={() => <GameScreen/>} />
                <Route exact path="/score" render={(props) => <EndScreen {...props}/>} />
            </Switch>
        </main>
        </ThemeProvider>
        );
}
ReactDOM.render(<MemoryRouter ><MainEntry /></MemoryRouter>, document.getElementById("root"));