import { useState } from "react";

function Square({ value, onSquareClick, squareInWinningLine }) {
  return (
    <button
      className={`square ${squareInWinningLine ? "winning-square" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay({
      squares: nextSquares,
      moveLocation: { row: Math.floor(i / 3), col: i % 3 },
    });
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + winner.winner;
  } else if (squares.indexOf(null) < 0) {
    status = "Game Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardRows = [];

  for (let row = 0; row < 3; row++) {
    const squareInRow = [];

    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      squareInRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          squareInWinningLine={winner && winner.winningLine.includes(index)}
        />,
      );
    }

    boardRows.push(
      <div className="board-row" key={row}>
        {squareInRow}
      </div>,
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), moveLocation: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove].squares;
  const xIsNext = currentMove % 2 === 0;
  const [isAscending, setIsAscending] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  let moves = history.map((step, move) => {
    const location = step.moveLocation;
    if (move === currentMove) {
      return <li key={move}>You are at move #{move}</li>;
    }

    let description;
    if (move > 0 && location) {
      description = `Go to move #${move} (${location.row}, ${location.col})`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (!isAscending) {
    moves = moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? "Ascending" : "Descending"}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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
      return { winner: squares[a], winningLine: lines[i] };
    }
  }
  return null;
}
