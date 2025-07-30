import React, { useState } from "react";
import "./App.css";

// Utility: determines winner given a board
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diags
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // Session state
  const [history, setHistory] = useState([]); // {winner, moves}
  const [gameKey, setGameKey] = useState(Date.now());

  // Start a new game (for session-based replay)
  function handleNewGame() {
    setGameKey(Date.now());
  }

  return (
    <div className="ttt-app-bg">
      <main className="ttt-main-container">
        <div className="ttt-board-column">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <GameBoard
            key={gameKey}
            onGameEnd={result =>
              setHistory([
                { ...result, timestamp: Date.now() },
                ...history,
              ])
            }
          />
          <button className="ttt-newgame-btn" onClick={handleNewGame}>
            New Game
          </button>
        </div>
        <aside className="ttt-sidebar">
          <SessionHistory history={history} />
          <div className="ttt-info-panel">
            <h3>How to Play</h3>
            <ul>
              <li>Player 1: <b>X</b></li>
              <li>Player 2: <b>O</b></li>
              <li>Click a square to make your move</li>
              <li>First to get 3 in a row wins!</li>
              <li>Game ends in a tie if no winner after 9 moves</li>
            </ul>
          </div>
        </aside>
      </main>
      <footer className="ttt-footer">
        <small>
          &copy; {new Date().getFullYear()} Interactive Tic Tac Toe
        </small>
      </footer>
    </div>
  );
}

// Board/game component
function GameBoard({ onGameEnd }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [finished, setFinished] = useState(false);
  const winner = calculateWinner(squares);
  const movesMade = squares.filter(Boolean).length;
  const isDraw = !winner && movesMade === 9;

  function handleClick(idx) {
    if (squares[idx] || winner || finished) return;
    const nsq = squares.slice();
    nsq[idx] = xIsNext ? "X" : "O";
    setSquares(nsq);
    setXIsNext(!xIsNext);
    if (calculateWinner(nsq) || nsq.filter(Boolean).length === 9) {
      setTimeout(() => {
        setFinished(true);
        onGameEnd && onGameEnd({
          winner: calculateWinner(nsq),
          moves: nsq,
        });
      }, 350);
    }
  }

  function renderStatus() {
    if (winner)
      return <span className="ttt-status-win">{winner} wins!</span>;
    if (isDraw)
      return <span className="ttt-status-draw">It's a draw.</span>;
    return (
      <span>
        Next move:&nbsp;
        <span
          className={
            xIsNext
              ? "ttt-player-x"
              : "ttt-player-o"
          }
        >
          {xIsNext ? "X" : "O"}
        </span>
      </span>
    );
  }

  function renderSquare(i) {
    const val = squares[i];
    return (
      <button
        key={i}
        className={`ttt-square ${val === "X" ? "ttt-x" : val === "O" ? "ttt-o" : ""}`}
        onClick={() => handleClick(i)}
        aria-label={`Square ${i + 1}, value: ${val ? val : "empty"}`}
        disabled={Boolean(val) || winner || finished}
      >
        {val}
      </button>
    );
  }

  return (
    <div className="ttt-board-area">
      <div className="ttt-status-bar">{renderStatus()}</div>
      <div className="ttt-board-grid">
        {[0, 1, 2].map(row =>
          <div className="ttt-board-row" key={row}>
            {[0, 1, 2].map(col =>
              renderSquare(row * 3 + col)
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Session history panel (in-session)
function SessionHistory({ history }) {
  if (!history.length) {
    return (
      <div className="ttt-history">
        <h3>Game History</h3>
        <div className="ttt-history-empty">No games this session yet.</div>
      </div>
    );
  }
  return (
    <div className="ttt-history">
      <h3>Game History</h3>
      <ol>
        {history.map((h, idx) => (
          <li key={h.timestamp}>
            <span className="ttt-hist-item">
              <b>
                {h.winner
                  ? `${h.winner} won`
                  : "Draw"}
              </b>{" "}
              <span className="ttt-hist-timestamp">
                {new Date(h.timestamp)
                  .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </span>
            <MiniBoard moves={h.moves} />
          </li>
        ))}
      </ol>
    </div>
  );
}

// Mini 3x3 board for history (readonly)
function MiniBoard({ moves }) {
  return (
    <div className="ttt-mini-board">
      {moves.map((val, idx) => (
        <span key={idx} className={`ttt-mini-cell ${val ? `mini-${val}` : ""}`}>
          {val}
        </span>
      ))}
    </div>
  );
}

export default App;
