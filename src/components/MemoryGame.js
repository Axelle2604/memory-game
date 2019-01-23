import React, { Component } from 'react';
import Card from './Card.js';
import './memoryGame.css';
const axios = require('axios');
const lodash = require('lodash');

const nbPairsCardsToFind = 3;
const hiddenCard = 'hiddenCard';
const displayedCard = 'displayedCard';

class App extends Component {
  constructor() {
    super();

    this.state = {
      stateCard: hiddenCard,
      minutes: 0,
      seconds: 0,
      stateGame: 'startGame',
      nbPairsCardsFound: 0,
      listCards: [],
      startSelection: false,
      firstCardSelected: 'a',
      lastCardSelected: 'b',
      nbShotsPlayed: 0,
      missed: 0,
    };
  }

  async componentDidMount() {
    const { data } = await axios.get(
      'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/all.json'
    );
    const tabCards = data.slice(0, nbPairsCardsToFind);
    this.setState({
      listCards: lodash.shuffle([...tabCards, ...tabCards]),
    });
  }

  displayStartGameOnScreen() {
    return (
      <div className="startGameScreen">
        <button
          className="startButton"
          onClick={this.onClickStartGameButton.bind(this)}
        >
          <span className="memoryGameTxt">Memory Game</span>
          <span className="startGameTxt">Start Game</span>
        </button>
      </div>
    );
  }

  onClickStartGameButton() {
    this.setState(
      {
        stateGame: 'inGame',
      },
      () => this.startCountDown()
    );
  }

  startCountDown() {
    this.intervalTimer = setInterval(() => {
      this.setState({
        //minutes: Math.round(this.states.seconds % 60),
        seconds: this.state.seconds + 1,
      });
    }, 1000);
  }

  displayInGameScreen() {
    return (
      <div>
        <div className="timer">
          {this.state.seconds}s | Coups joués : {this.state.nbShotsPlayed}
        </div>
        <div className="containerCards">
          {this.state.listCards.map(card => (
            <div>
              <Card
                key={card.id}
                image={card.images.sm}
                onClickCard={this.onClickCard.bind(this, card.name)}
                name={card.name}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  onClickCard(event, cardName) {
    const { startSelection } = this.state;
    console.log('target : ' + event);
    //e.target.className = { displayedCard };

    if (!startSelection) {
      this.setState(
        {
          firstCardSelected: cardName,
          startSelection: true,
        },
        () => console.log('First selection : ' + this.state.firstCardSelected)
      );
    } else {
      this.setState(
        {
          lastCardSelected: cardName,
          startSelection: false,
        },
        () => this.checkCardSimilarity()
      );
    }
  }

  checkCardSimilarity() {
    const { firstCardSelected, lastCardSelected } = this.state;

    if (firstCardSelected === lastCardSelected) {
      this.setState(
        {
          nbPairsCardsFound: this.state.nbPairsCardsFound + 1,
          nbShotsPlayed: this.state.nbShotsPlayed + 1,
        },
        () => {
          if (this.state.nbPairsCardsFound === nbPairsCardsToFind) {
            console.log('gagné');
            this.setState({
              stateGame: 'endGame',
            });
          }
        }
      );

      console.log('similarité');
    } else {
      this.setState({
        missed: this.state.missed + 1,
        nbShotsPlayed: this.state.nbShotsPlayed + 1,
      });
    }
  }

  displayEndGameScreen() {
    const sumAccurency = Math.round(
      ((nbPairsCardsToFind - this.state.missed) * 100) / nbPairsCardsToFind
    );

    return (
      <div className="endGame">
        <div>Partie terminée !</div>
        <br />
        <div>
          Nombre de tours joués : {this.state.nbShotsPlayed} <br />
          Précision : {sumAccurency < 0 ? 0 : sumAccurency}% <br />
          Nombre de cartes retournées : {nbPairsCardsToFind}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="memoryGame">
        {this.state.stateGame === 'startGame' ? (
          <div>{this.displayStartGameOnScreen()}</div>
        ) : null}
        {this.state.stateGame === 'inGame' ? (
          <div>{this.displayInGameScreen()}</div>
        ) : null}
        {this.state.stateGame === 'endGame' ? (
          <div>{this.displayEndGameScreen()}</div>
        ) : null}
      </div>
    );
  }
}

export default App;
