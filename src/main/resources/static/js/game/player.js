class Player {
    id = 0;
    isTurn = true;
    isSelect = false;
    selectPos = new Point(-1, -1);
    selectPiece = undefined;
    lastSelectPos = new Point(-1, -1);
    lastSelectPiece = undefined;

    moves = {
        rounds : new Array(),
        append(piece, from, to){
            rounds.append(new Move(piece, from, to))
        }
    }

    lastMove = {
        from : new Point(0, 0),
        to : new Point(0, 0),
        set : function (from, to){
            this.from.assign(from);
            this.to.assign(to)
        }
    }

    constructor(id){
        this.id = id;
    }

    deSelect(){
        this.isSelect = false;
        this.selectPos = new Point(-1, -1);
        this.selectPiece = undefined;
    }
}

Move = class {
    piece = null;
    from = null;
    to = null;
    constructor(piece, from, to){
        this.piece = piece;
        this.from = from;
        this.to = to;
    }
}