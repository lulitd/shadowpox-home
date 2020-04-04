import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route } from 'react-router-dom';
import {ThemeProvider} from "theme-ui";
import theme from './theme';
import GameScreen from "./screens/gameScreen";
import MainMenuScreen from "./screens/MainMenuScreen";
const MainEntry = () => {
    return (
        <ThemeProvider theme={theme}>
        <main>
            <Switch>
                <Route exact path="/" render={() => <MainMenuScreen />} />
                <Route path="/game" render={() => <GameScreen/>} />
            </Switch>
        </main>
        </ThemeProvider>
        );
}
ReactDOM.render(<HashRouter ><MainEntry /></HashRouter>, document.getElementById("root"));