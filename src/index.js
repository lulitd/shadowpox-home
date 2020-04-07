import React from "react";
import ReactDOM from "react-dom";
import {Switch, Route, MemoryRouter,HashRouter } from 'react-router-dom';
import {ThemeProvider} from "theme-ui";
import theme from './theme';
import {Game,End,MainMenu,Intro} from "./screens"

const MainEntry = () => {
    return (
        <ThemeProvider theme={theme}>
        <main>
            <Switch>
                <Route exact path="/" render={() => <MainMenu />} />
                <Route exact path="/intro" render={() => <Intro />} />
                <Route exact path="/game" render={() => <Game/>} />
                <Route exact path="/score" render={(props) => <End {...props}/>} />
            </Switch>
        </main>
        </ThemeProvider>
        );
}
ReactDOM.render(<MemoryRouter ><MainEntry /></MemoryRouter>, document.getElementById("root"));