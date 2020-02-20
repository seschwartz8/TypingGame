import { Player } from './Player';

export class Game {
  constructor() {
    this.characters = [];
    this.words = [];
    this.startTime;
    this.gameTime = 0;
    this.timer;
    this.players = [];
    this.charactersIndex = 0;
    this.wordsIndex = 0;
    this.inputtedCharacters = [];
    this.paragraph = '';
    this.errors = 0;
    this.wordsCorrect = 0;
    this.currentPlayer;
    this.roundCount = 0;
  }

  incrementRoundCount() {
    this.roundCount++;
  }

  getRoundCount() {
    return this.roundCount;
  }

  resetRoundCount() {
    this.roundCount = 0;
  }

  setCurrentPlayer(value) {
    this.currentPlayer = this.players[value];
  }

  getErrors() {
    return this.errors;
  }

  incrementErrors() {
    this.errors++;
  }

  setSeconds(seconds) {
    this.seconds = seconds;
  }

  getCharacters() {
    return this.characters;
  }

  setCharacters(paragraph) {
    this.characters = paragraph.split('');
  }

  getWords() {
    return this.words;
  }

  getGameTime() {
    return this.gameTime;
  }

  setWords(paragraph) {
    this.words = paragraph.split(' ');
  }

  getCharacterIndex() {
    return this.charactersIndex;
  }

  resetCharacterIndex() {
    this.charactersIndex = 0;
  }

  incrementCharacterIndex() {
    this.charactersIndex++;
  }

  decrementCharacterIndex() {
    this.charactersIndex--;
  }

  getStartTime() {
    return this.startTime;
  }

  setStartTime() {
    this.startTime = Math.floor(Date.now() / 1000);
  }

  setGameTime(time) {
    this.gameTime = time;
  }

  setParagraph(paragraph) {
    this.paragraph = paragraph;
  }

  setText(paragraph) {
    this.setInputtedCharacters([]);
    this.setCharacters('');
    this.setWords('');
    this.setCharacters(paragraph);
    this.setWords(paragraph);
    this.setParagraph(paragraph);
    this.charactersIndex = 0;
    this.errors = 0;
  }

  getInputtedCharacters() {
    return this.inputtedCharacters;
  }

  setInputtedCharacters(characters) {
    return (this.inputtedCharacters = characters);
  }

  addMatchBool(char) {
    this.inputtedCharacters.push(char);
  }

  startGame() {
    this.round = false;
    this.setGameTime(0);
    this.setStartTime();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.updateGameTime();
    }, 1000);
  }

  clearTimer() {
    clearInterval(this.timer);
    this.gameTime = 0;
  }

  updateGameTime() {
    let timeNow = Math.floor(Date.now() / 1000);
    let gameTime = timeNow - this.startTime;
    this.setGameTime(gameTime);
    this.setSeconds(Math.floor(gameTime / 1000) % 60);
  }

  checkWord() {
    let matches = [];
    let i = 0;
    while (
      this.characters[this.charactersIndex + i] !== ' ' &&
      this.charactersIndex + i >= 0
    ) {
      matches.push(this.inputtedCharacters[this.charactersIndex + i]);
      i--;
    }
    let checkMatches = matches => matches.every(match => match === true);
    if (checkMatches) {
      this.wordsCorrect = this.wordsCorrect + 1;
    }
  }

  changePlayer() {
    if (this.players.length !== 1) {
      this.incrementRoundCount();
      if (this.currentPlayer === this.players[0]) {
        this.setCurrentPlayer(1);
      } else {
        this.setCurrentPlayer(0);
      }
    } else {
      this.setCurrentPlayer(0);
    }
  }

  checkCharacter(pushedKey) {
    if (pushedKey === 8) {
      if (
        this.charactersIndex > 0 &&
        this.characters[this.charactersIndex] !== ' '
      ) {
        this.decrementCharacterIndex();
        this.inputtedCharacters.pop();
      }
    } else {
      if (this.charactersIndex < this.characters.length && pushedKey !== 8) {
        let charCodeAtIndex = this.characters[this.charactersIndex].charCodeAt(
          0
        );
        if (pushedKey === 32 && charCodeAtIndex === 32) {
          this.checkWord();
          this.addMatchBool(true);
        } else if (pushedKey === 32 && charCodeAtIndex !== 32) {
          this.addMatchBool(false);
        } else if (charCodeAtIndex !== pushedKey) {
          this.incrementErrors();
          this.addMatchBool(false);
        } else if (charCodeAtIndex === pushedKey) {
          this.addMatchBool(true);
        }
        this.incrementCharacterIndex();
      }
    }
  }

  calculateScore() {
    if (this.currentPlayer instanceof Player) {
      this.currentPlayer.setWordsPerMinute(this.calculateWordsPerMinute());
      this.currentPlayer.setCharactersPerMinute(
        this.calculateCharactersPerMinute()
      );
      this.currentPlayer.setErrors(this.getErrors());
    }
  }

  calculateWordsPerMinute() {
    if (this.gameTime === 0) {
      return 0;
    } else if (this.wordsCorrect === 0) {
      return 0;
    } else {
      let wordsPerMinute = Math.floor((this.wordsCorrect / this.gameTime) * 60);
      return wordsPerMinute;
    }
  }

  calculateCharactersPerMinute() {
    let numberOfCorrectMatches = 0;
    let charactersPerMinute = 0;
    if (this.gameTime === 0) {
      return 0;
    }
    for (let i = 0; i < this.inputtedCharacters.length; i++) {
      if (this.inputtedCharacters[i]) {
        numberOfCorrectMatches = numberOfCorrectMatches + 1;
      }
    }
    if (numberOfCorrectMatches === 0) {
      return 0;
    } else {
      charactersPerMinute = Math.floor(
        (numberOfCorrectMatches / this.gameTime) * 60
      );
    }
    return charactersPerMinute;
  }

  isRoundOver() {
    if (this.inputtedCharacters.length === this.characters.length) {
      return true;
    } else {
      return false;
    }
  }

  addPlayer(playerObj) {
    this.players.push(playerObj);
    this.setCurrentPlayer(0);
  }

  isTwoPlayer() {
    return this.players.length === 2 ? true : false;
  }
}
