import React from 'react';
import {calculateWinner, findBestSquare, getWinningLine, isBoardFilled} from "../helpers";
import Board from './Board'

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameMode: 2, // AI default mode
            history: [
                {
                    squares: Array(9).fill(null),
                    points: Array(2).fill(null),
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }

    makeMove(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // Check if not empty square or winner
        if (calculateWinner(squares) || squares[i]) {
            return Promise.resolve();
        }

        // continue
        squares[i] = this.state.xIsNext ? "X" : "O";

        const nextState = {
            history: history.concat([
                {
                    squares: squares,
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        };

        // Return a Promise that resolves when setState completes.
        return new Promise((resolve) => {
            this.setState(nextState, resolve);
        });
    }

    async handleClick(i) {
        // Apply player move to square i
        await this.makeMove(i);

        // check if AI player

        if(this.state.gameMode === 2){
            // Apply AI move
            const squares = this.state.history[this.state.stepNumber].squares.slice();
            const bestSquare = findBestSquare(squares, this.state.xIsNext ? "X" : "O");
            if (bestSquare !== -1) {
                await this.makeMove(bestSquare);
            }
        }


    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    gameMode(mode) {
        this.setState({
            gameMode: mode
        });
    }

    resetGame() {
        this.setState({
            gameMode: 2,
            history: [
                {
                    squares: Array(9).fill(null),
                    points: Array(2).fill(null),
                }
            ],
            stepNumber: 0,
            xIsNext: true
        })
        this.jumpTo(0)
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const winningLine = getWinningLine(current.squares);
        const draw = !winner && isBoardFilled(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ? `Move ${move}` : 'Start';
            return (
                <li key={move}>
                    <button
                        className={move === this.state.stepNumber ? 'is-current' : ''}
                        onClick={() => this.jumpTo(move)}
                    >
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        let statusClass = 'status';
        if (winner) {
            status = `${winner} wins`;
            statusClass += ' status--win';
        } else if (draw) {
            status = 'Draw';
            statusClass += ' status--draw';
        } else {
            status = `${this.state.xIsNext ? 'X' : 'O'} to play`;
            statusClass += this.state.xIsNext ? ' status--x' : ' status--o';
        }

        return (
            <div className="app">
                <header className="app-header">
                    <p className="eyebrow">Tabletop classic</p>
                    <h1>Tic Tac Toe</h1>
                </header>

                <div className="game">
                    <section className="panel panel--board">
                        <div className={statusClass}>{status}</div>
                        <Board
                            squares={current.squares}
                            winningLine={winningLine}
                            onClick={i => this.handleClick(i)}
                        />
                    </section>

                    <aside className="panel panel--side">
                        <div className="modes" role="group" aria-label="Game mode">
                            <button
                                className={this.state.gameMode === 1 ? 'is-active' : ''}
                                onClick={() => this.gameMode(1)}
                            >
                                2 Player
                            </button>
                            <button
                                className={this.state.gameMode === 2 ? 'is-active' : ''}
                                onClick={() => this.gameMode(2)}
                            >
                                Versus AI
                            </button>
                        </div>
                        <button className="reset" onClick={() => this.resetGame()}>
                            Reset board
                        </button>
                        <div className="history">
                            <h2>Moves</h2>
                            <ol>{moves}</ol>
                        </div>
                    </aside>
                </div>
            </div>
        );
    }
}

export default Game;
