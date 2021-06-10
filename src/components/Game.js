import React from 'react';
import {calculateWinner, findBestSquare, isBoardFilled} from "../helpers";
import Board from './Board'

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameMode: 1, // 2 players default mode
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
        return new Promise((resolve, reject) => {
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
        console.log(mode)
        this.setState({
            gameMode: mode
        });

    }

    resetGame() {
        this.setState({
            gameMode: 1,
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
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        }
        else if (isBoardFilled(current.squares)) {
            status = "Draw!";
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>

                <div className="game-type">
                    <button onClick={() => this.gameMode(1)}>2 Player</button>
                    <button onClick={() => this.gameMode(2)}>Versus AI</button>
                    <button onClick={() => this.resetGame()}>Reset Board</button>
                </div>
            </div>
        );
    }
}

export default Game;