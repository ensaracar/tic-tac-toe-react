import { Square } from './Square';

export default function Board({ squares, winningLine, onClick }) {
    return (
        <div className="board" role="grid" aria-label="Tic tac toe board">
            {squares.map((value, i) => (
                <Square
                    key={i}
                    value={value}
                    winning={winningLine?.includes(i)}
                    onClick={() => onClick(i)}
                />
            ))}
        </div>
    );
}
