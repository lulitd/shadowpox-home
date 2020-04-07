import React from "react";
import ReactDOM from "react-dom";
import {Switch, Route, HashRouter } from 'react-router-dom';
import {ThemeProvider} from "theme-ui";
import theme from './theme';
import {Game,End,MainMenu,Intro} from "./screens"

const MainEntry = () => {
    return (
        <HashRouter>
        <ThemeProvider theme={theme}>
        <main>
            <Switch>
                <Route exact path="/" render={() => <MainMenu />} />
                <Route exact path="/intro" render={() => <Intro />} />
                <Route exact path="/game" render={(props) => <Game {...props}/>} />
                <Route exact path="/score" render={(props) => <End {...props}/>} />
            </Switch>
        </main>
        </ThemeProvider>
        </HashRouter>
        );
}
ReactDOM.render(<MainEntry />, document.getElementById("root"));