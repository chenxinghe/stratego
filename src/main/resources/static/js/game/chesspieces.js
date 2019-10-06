/*
 * @author Zihao Zheng
 */

RANK_TO_NAME = [
    "Boom",
    "Spy",
    "Scout",
    "Miner",
    "Sergeant",
    "Lieutenant",
    "Captain",
    "Major",
    "Colonel",
    "General",
    "Marshal",
    "Flag"
]

TOTAL_PIECE_FOR_EACH_RANK = [
    6, //B
    1, //1
    8, //2
    5, //3
    4, //4
    4, //5
    4, //6
    3, //7
    2, //8
    1, //9
    1, //10
    1 //F
]

MOVE_TYPE_WITH_DIFF_RANK = [
    0, //B
    1, //1
    2, //2
    1, //3
    1, //4
    1, //5
    1, //6
    1, //7
    1, //8
    1, //9
    1, //10
    0  //F
]

/*
 * ChessPiece Entity
 */
class Piece {
    id = 0;
    team = 0;
    rank = -1;
    moveType = 0;
    pos = null;
    isHide = true
    constructor(id, team, rank, moveType, pos, isCover){
        this.id = id;
        this.team = team;
        this.rank = rank;
        this.movetype = moveType;
        this.pos = pos;
        this.isHide = isCover;
    }
    attack(piece){
        if (this.rank == 2){
            piece.isHide = false;
        }
        if (piece.rank == 11){
                console.log("Team " + this.team + " Win" )
            return "WIN"
        }
        if(piece.rank == 0 &  this.rank != 3){
            console.log("Boom, died")
            return "KILLED"
        }
        if(this.rank == 1 & piece.rank == 10){
            console.log("Kill")
            return "KILL";
        }
        if (this.rank > piece.rank){
            console.log("Kill")
            return "KILL";
        }
        if (this.rank < piece.rank){
            console.log("die")
            return "KILLED"
        }
        if (this.rank == piece.rank){
            console.log("both, die")
            return "BOTH"
        }
    }
}

/*
 * ChessPiece group
 */
class ChessPieces {
    team1 = new Array(12);
    team2 = new Array(12);

    init(chessBoardData){
        let id = 0;
        let tx = 0, ty = 3;
        let bx = 0, by = 6;

        let sis1 = Tools.getAiIdSet();
        let sis2 = Tools.getSlotsIdSet(60);

        for(let r = 0; r < 13; r++){
            this.team1[r] = new Array(TOTAL_PIECE_FOR_EACH_RANK[r]);
            this.team2[r] = new Array(TOTAL_PIECE_FOR_EACH_RANK[r]);
            for(let p = 0; p < TOTAL_PIECE_FOR_EACH_RANK[r]; p++){
                let p1 = Tools.slotId2Pos(sis1[id]);
                let p2 = Tools.slotId2Pos(sis2[id]);

                this.team1[r][p] = new Piece(id, 1, r, MOVE_TYPE_WITH_DIFF_RANK[r], p1, true);
                chessBoardData[p1.y][p1.x] = this.team1[r][p];
                // this.team1[r][p].isHide = true;
                this.team1[r][p].isHide = true;

                this.team2[r][p] = new Piece(id, 2, r, MOVE_TYPE_WITH_DIFF_RANK[r], p2, false);
                chessBoardData[p2.y][p2.x] = this.team2[r][p];
                this.team2[r][p].isHide = false;
                id++;
                tx = (tx+1) % 10; ty = tx == 0 ? ty - 1 : ty;
                bx = (bx+1) % 10; by = bx == 0 ? by + 1 : by;
            }
        }
    }

    continueGameInit(){
        for(let r = 0; r < 12; r++){
            this.team1[r] = new Array();
            this.team2[r] = new Array();
        }
    }

    removePiece(chessBoardData, player, piece){
        let team = this["team" + piece.team];
        if (player.selectPiece == piece){
            player.deSelect();
        }
        let index = team[piece.rank].findIndex(function(elem) {
            return elem.id == piece.id;
        })
        chessBoardData[piece.pos.y][piece.pos.x] = undefined;
        team[piece.rank].splice(index, 1);
    }
}
