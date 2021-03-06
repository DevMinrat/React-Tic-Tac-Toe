import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className={props.isWinner ? "square winner" : "square"}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, winner) {
    return (
      <Square
        value={this.props.squares[i]}
        isWinner={winner}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winners = this.props.rowWinner;

    const rowsSquares = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];

    const squaresGrid = rowsSquares.map((s) => {
      return (
        <div className="board-row">
          {s.map((el) => {
            if (winners && winners.includes(el)) {
              return this.renderSquare(el, true);
            } else {
              return this.renderSquare(el, false);
            }
          })}
        </div>
      );
    });

    return <div>{squaresGrid}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      activeBtn: null,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      activeBtn: step,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "?????????????? ?? ???????? #" + move : "?? ???????????? ????????";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={this.state.activeBtn === move ? "activeBtn" : null}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `?????????????? ${winner[0]}`;
      console.log();
    } else if (!current.squares.includes(null)) {
      status = "??????????";
    } else {
      status = "?????????????????? ??????????: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            rowWinner={winner ? winner[1] : null}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return null;
}
