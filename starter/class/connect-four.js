const Screen = require("./screen");
const Cursor = require("./cursor");

class ConnectFour {

  constructor() {

    this.playerX = "X";
    this.playerO = "O";
    this.turn = [this.playerX, this.playerO];

    this.grid = [[' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ']]

    this.cursor = new Cursor(6, 7);

    // Initialize a 6x7 connect-four grid
    Screen.initialize(6, 7);
    Screen.setGridlines(true);

    // Replace this with real commands
    Screen.addCommand('t', 'test command (remove)', ConnectFour.testCommand);

    Screen.addCommand('w', 'cursor up', () => {
      this.cursor.up();
      Screen.render();
    });

    Screen.addCommand('s', 'cursor down', () => {
      this.cursor.down();
      Screen.render();
    });

    Screen.addCommand('d', 'cursor up', () => {
      this.cursor.right();
      Screen.render();
    });

    Screen.addCommand('a', 'cursor up', () => {
      this.cursor.left();
      Screen.render();
    });

    Screen.addCommand('p', 'place cursor', () => {
      // When we press p we want to place a cursor at said position
      const position = [this.cursor.row, this.cursor.col];

      if (Screen.grid[position[0]][position[1]] === ' ') {
        Screen.setGrid(position[0], position[1], this.turn[0]);
        ConnectFour.rotate(this.turn);
        Screen.render();

        this.gameState = ConnectFour.checkWin(Screen.grid);
        if (this.gameState !== false) ConnectFour.endGame(this.gameState);
      }

    });

    this.cursor.setBackgroundColor();
    Screen.render();
  }

  // Remove this
  static testCommand() {
    console.log("TEST COMMAND");
  }

  // Rotate turn
  static rotate(turn) {
    [turn[0], turn[1]] = [turn[1], turn[0]];

    return true;
  }

  static countSpaces(grid) {
    let countedSpaces = 0;

    for (let i = 0; i < grid.length; i++) {

      for (let j = 0; j < grid.length; j++) {

        if (grid[i][j] === ' ') countedSpaces++;
      }
    }

    return countedSpaces;
  }

  static isEmptyGrid(grid) {
    let countedSpaces = 0;

    for (let i = 0; i < grid.length; i++) {

      for (let j = 0; j < grid.length; j++) {

        if (grid[i][j] === ' ') countedSpaces++;
      }
    }

    return (countedSpaces === grid.length * grid.length) ? true : false;
  }

  static checkWin(grid) {

    if (this.countSpaces(grid) > 0) { // There no win yet
      // Return 'X' if player X wins
      // Return 'O' if player O wins
      let horizontalWin = this.checkHorizontal(grid);
      if (horizontalWin) return horizontalWin; // Note: it will be X or O

      let verticalWin = this.checkVertical(grid);
      if (verticalWin) return verticalWin; // Note: it will be X or O

      // check for diagonal win
      let diagonalWin = this.diagonalCheck(grid);
      if (diagonalWin) return diagonalWin; // Note: it will be X or O

      return false;
    } else {
      return 'T'; // its a tie
    }

  }

  static checkHorizontal(grid) {
    const playerX = "X";
    const playerO = "O";

    for (let i = 0; i < grid.length; i++) {
      const STREAK = [];

      for (let j = 0; j < grid[i].length; j++) {
        STREAK.push(grid[i][j]);
      }

      // if (STREAK.every((char) => char === playerX)) return playerX;

      let xCount = 0

      for (let i = 0; i < STREAK.length; i++) {
        const char = STREAK[i];

        // check for 4 count streak
        if (char === playerX) {
          xCount++;
          if (xCount === 4) return playerX;
        } else {
          xCount = 0;
        }

      }

      // if (STREAK.every((char) => char === playerO)) return playerO;

      let OCount = 0

      for (let i = 0; i < STREAK.length; i++) {
        const char = STREAK[i];

        // check for 4 count streak
        if (char === playerO) {
          OCount++;
          if (OCount === 4) return playerO;
        } else {
          OCount = 0;
        }
      }

    }

    return false;
  }


  static checkVertical(grid) {
    const playerX = "X";
    const playerO = "O";

    for (let i = 0; i < grid[0].length; i++) {
      const STREAK = [];

      for (let j = 0; j < grid.length; j++) {
        STREAK.push(grid[j][i]);
      }

      // if (STREAK.every((char) => char === playerX)) return playerX;

      let xCount = 0

      for (let i = 0; i < STREAK.length; i++) {
        const char = STREAK[i];

        // check for 4 count streak
        if (char === playerX) {
          xCount++;
          if (xCount === 4) return playerX;
        } else {
          xCount = 0;
        }

      }

      // if (STREAK.every((char) => char === playerO)) return playerO;

      let OCount = 0

      for (let i = 0; i < STREAK.length; i++) {
        const char = STREAK[i];

        // check for 4 count streak
        if (char === playerO) {
          OCount++;
          if (OCount === 4) return playerO;
        } else {
          OCount = 0;
        }
      }

    }

    return false;
  }

  static diagonalCheck(grid) {
    const result1 = this.diagonalTLeft(grid);
    if (result1) return result1;

    const result2 = this.diagonalBRight(grid);
    if (result2) return result2;

    return false;
  }

  static diagonalTLeft(grid) {
    let row = 0;
    let column = 0;
    const streak = [];

    // left to mid
    while (row < grid.length - 1) {
      let decresingRow = row;
      let increasingColumn = column;

      while (decresingRow >= 0) {
        streak.push(grid[decresingRow][increasingColumn]);

        decresingRow--;
        increasingColumn++;
      }

      const isStreak = this.checkStreak(streak);
      if (isStreak) return isStreak;

      row++;
    }

    // mid to right
    while (column < grid[0].length) {
      let decresingRow = grid.length - 1;
      let increasingColumn = column;

      while (decresingRow > 0 && increasingColumn < grid[0].length) {
        streak.push(grid[decresingRow][increasingColumn]);

        decresingRow--;
        increasingColumn++;
      }

      const isStreak = this.checkStreak(streak);
      if (isStreak) return isStreak;

      column++;
    }

    return false;
  }

  static diagonalBRight(grid) {
    let row = grid.length - 1;
    let col = 0;

    // left to mid
    while (row > 0) {
      let decresingRow = row;
      let increasingColumn = 0;
      const streak = [];

      while (decresingRow < grid.length) {
        streak.push(grid[decresingRow][increasingColumn]);

        decresingRow++;
        increasingColumn++;
      }

      const isStreak = this.checkStreak(streak);
      if(isStreak) return isStreak;

      row--;
    }

    // mid to right
    while (col < grid[0].length) {
      let decresingRow = row;
      let increasingColumn = col;
      const streak = [];

      while (decresingRow < grid.length && increasingColumn < grid[0].length) {
        streak.push(grid[decresingRow][increasingColumn]);

        decresingRow++;
        increasingColumn++;
      }

      const isStreak = this.checkStreak(streak);
      if(isStreak) return isStreak;

      col++;
    }

    return false;
  }

  static checkStreak(streak) {
    let count = 0;
    let currentChar = null;

    for (let i = 0; i < streak.length; i++) {
      const char = streak[i];

      if (char === ' ') {
        // Reset count for empty space
        count = 0;
        currentChar = null;
      } else if (char === currentChar) {
        count++;
        if (count === 4) {
          return currentChar;
        }
      } else {
        count = 1;  // Reset count for the new character
        currentChar = char;
      }

    }

    return false;
  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = ConnectFour;
