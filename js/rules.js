// Initial chessboard setup
function getInitialBoard() {
    return [
        ["b_rook", "b_knight", "b_bishop", "b_queen", "b_king", "b_bishop", "b_knight", "b_rook"],
        ["b_pawn", "b_pawn", "b_pawn", "b_pawn", "b_pawn", "b_pawn", "b_pawn", "b_pawn"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn"],
        ["w_rook", "w_knight", "w_bishop", "w_queen", "w_king", "w_bishop", "w_knight", "w_rook"]
    ];
}

// Unicode symbols for chess pieces
function getPieceSymbol(piece) {
    const symbols = {
        w_pawn: "♙", w_rook: "♖", w_knight: "♘", w_bishop: "♗", w_queen: "♕", w_king: "♔",
        b_pawn: "♟", b_rook: "♜", b_knight: "♞", b_bishop: "♝", b_queen: "♛", b_king: "♚"
    };
    return symbols[piece] || "";
}

// Get piece color ("white" or "black")
function getPieceColor(piece) {
    return piece.startsWith("w") ? "white" : "black";
}

// Get all valid moves for a piece
function getValidMoves(row, col, piece, board) {
    const moves = [];
    const color = getPieceColor(piece);
    const type = piece.split("_")[1];
    const directions = {
        rook: [[1,0], [-1,0], [0,1], [0,-1]],
        bishop: [[1,1], [1,-1], [-1,1], [-1,-1]],
        queen: [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]],
        knight: [[2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2]],
        king: [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]]
    };

    switch (type) {
        case "pawn":
            const dir = color === "white" ? -1 : 1;
            if (!board[row + dir][col]) moves.push([row + dir, col]);
            if (color === "white" && row === 6 && !board[row - 1][col] && !board[row - 2][col]) moves.push([row - 2, col]);
            if (color === "black" && row === 1 && !board[row + 1][col] && !board[row + 2][col]) moves.push([row + 2, col]);
            [[dir, -1], [dir, 1]].forEach(([dr, dc]) => {
                if (board[row + dr] && board[row + dr][col + dc] && getPieceColor(board[row + dr][col + dc]) !== color) {
                    moves.push([row + dr, col + dc]);
                }
            });
            break;

        case "rook":
        case "bishop":
        case "queen":
            directions[type].forEach(([dr, dc]) => {
                let r = row + dr, c = col + dc;
                while (board[r] && board[r][c] !== undefined) {
                    if (!board[r][c]) {
                        moves.push([r, c]);
                    } else {
                        if (getPieceColor(board[r][c]) !== color) moves.push([r, c]);
                        break;
                    }
                    r += dr; c += dc;
                }
            });
            break;

        case "knight":
            directions.knight.forEach(([dr, dc]) => {
                const r = row + dr, c = col + dc;
                if (board[r] && board[r][c] !== undefined && (!board[r][c] || getPieceColor(board[r][c]) !== color)) {
                    moves.push([r, c]);
                }
            });
            break;

        case "king":
            directions.king.forEach(([dr, dc]) => {
                const r = row + dr, c = col + dc;
                if (board[r] && board[r][c] !== undefined && (!board[r][c] || getPieceColor(board[r][c]) !== color)) {
                    moves.push([r, c]);
                }
            });
            break;
    }

    return moves;
}

// Check if move is valid
function isValidMove(fromRow, fromCol, toRow, toCol, piece, board, turn) {
    if (getPieceColor(piece) !== turn) return false;
    return getValidMoves(fromRow, fromCol, piece, board)
        .some(([r, c]) => r === toRow && c === toCol);
}
