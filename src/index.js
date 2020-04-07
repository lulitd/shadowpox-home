import React from "react";
import ReactDOM from "react-dom";
import {Switch, Route, MemoryRouter } from 'react-router-dom';
import {ThemeProvider} from "theme-ui";
import theme from './theme';
import {Game,End,MainMenu,Intro} from "./screens"
import WebFontLoader from "webfontloader";

WebFontLoader.load({
    google: {
      families: ["Jura:300,400,500,700,900", "Material Icons"]
    }
  });

const MainEntry = () => {
    return (
        <MemoryRouter>
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
        </MemoryRouter>
        );
}
ReactDOM.render(<MainEntry />, document.getElementById("root"));