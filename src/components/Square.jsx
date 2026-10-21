export function Square({ value, winning, onClick }) {
    const classes = [
        'square',
        value && `square--${value.toLowerCase()}`,
        winning && 'square--win',
    ].filter(Boolean).join(' ');

    return (
        <button className={classes} onClick={onClick} aria-label={value || 'Empty square'}>
            <span className="square-mark">{value}</span>
        </button>
    );
}
