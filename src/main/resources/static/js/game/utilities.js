Tools = {
    slotId2Pos : function(slotId){
        y = Math.floor(slotId / 10);
        x = Math.floor(slotId % 10);
        // console.log("slotId: " + slotId  + ", x: " + x + ", y: " + y);
        return new Point(x, y);
    },

    getSlotsIdSet : function (startPos){
        let slotsIdSet = new Array();
        for (let i = 0; i < 40; i++){
            slotsIdSet[i] = startPos + i;
        }
        slotsIdSet.sort(function (a, b) { return Math.random() > 0.5 ? -1 : 1; });
        return slotsIdSet;
    },

    convert2DServer12local(board, chessBoard, chesspieces){
        let id = 0;
        chesspieces.continueGameInit();
        for(let slot_id = 0; slot_id < board.length; slot_id++) {
            let pos = this.slotId2Pos(slot_id);
            if (board[slot_id] == 0){
                chessBoard[pos.y][pos.x] = undefined;
            }else if (board[slot_id] == -1){
                chessBoard[pos.y][pos.x] = "water";
            }else{
                console.log(Math.floor(board[slot_id] / 1000))
                let isHide = Math.floor(board[slot_id] / 1000) == 1 ? false : true;
                let team = Math.floor((board[slot_id] % 1000) / 100);
                let rank = board[slot_id] % 1000 % 100;
                let piece = new Piece(id, team, rank, MOVE_TYPE_WITH_DIFF_RANK[rank], pos, isHide);
                piece.isHide = isHide;
                chesspieces["team" + team][rank].push(piece);
                chessBoard[pos.y][pos.x] = piece;
            }
            id++;
        }
    },

    createGameServerOjb:function(stratego){
        let game = {
            username: "",
            result: "",
            finished:"false",
            board_start: this.board2d21d(stratego.chessBoardData),
            pieces_left: this.createPiecesLeftServerOjb(stratego),
            turn: [this.createTurnServerOjb(stratego)]
        };
        return game;
    },

    createTurnServerOjb:function(stratego){
        let turn = {
            player: stratego.player1.isTurn ? 1 : 2,
            board: Tools.board2d21d(stratego.chessBoardData)
        }
        return turn;
    },

    createPiecesLeftServerOjb:function(stratego){
        let lp = [new Array (12), new Array (12)]

        for(let r = 0; r < 12; r++){
            lp[0][r] = stratego.chessPieces.team1[r].length;
            lp[1][r] = stratego.chessPieces.team2[r].length;
        }
        return lp;
    },


    board2d21d: function (chessBoardData){
        let slots_id = 0;
        var board = Array(100)
        for(let y = 0; y < 10; y++){
            for (let x = 0; x < 10; x++){
                if (chessBoardData[y][x] === undefined ) {
                    board[slots_id] = 0;
                }else if  (chessBoardData[y][x] == "water"){
                    board[slots_id] = -1;
                }else{
                    let rank = chessBoardData[y][x].rank;
                    let teamid = chessBoardData[y][x].team;
                    let hide = chessBoardData[y][x].isHide ? 0 : 1000;
                    // console.log("piece: " + (teamid * 100 + rank) + " at x: " +  x + ", y: " + y);
                    board[slots_id] = teamid * 100 + rank + hide;
                }
                slots_id++;
            }
        }
        return board;
    },

    getAiIdSet  : function () {

        let board = new Array(40);
        //set flag--1
        //console.log("flag")

        let flag= Math.floor(Math.random() * 6)+32
        board[39]=flag;

        //set boom--6
        //console.log("boom")
        let temp=0;
        while(temp<6){
            let boom=Math.floor(Math.random() * 20)+10
            if(!board.includes(boom)){
                board[temp]=boom;
                temp++;
            }
        }
        //console.log(board);

        //set spy--1
        //console.log("111")
        temp=0;
        while(temp<1){
            let spy=Math.floor(Math.random() * 30)+10
            if(!board.includes(spy)){
                board[6]=spy;
                temp++;
            }
        }
        //scout--8
        //console.log("scout")
        temp=0;
        while(temp<8){
            let scout=Math.floor(Math.random() * 10);
            if(!board.includes(scout)){
                board[7+temp]=scout;
                temp++;
            }
        }
        // set 10 -- 1
        //console.log("1010")
        temp=0;
        while(temp<1){
            let chess10=Math.floor(Math.random() * 20)+10;
            if(!board.includes(chess10)){
                board[38]=chess10;
                temp++;
            }
        }

        // set 9 -- 1
        //console.log("9999")
        while(true){
            let chess9=Math.floor(Math.random() * 39);
            if(!board.includes(chess9)){
                board[37]=chess9;
                break;
            }
        }


        // set 8 -- 2
        //console.log("8888")
        temp=0;
        while(temp<2){
            let chess8=Math.floor(Math.random() * 39);
            if(!board.includes(chess8)){
                board[35+temp]=chess8;
                temp++;
            }
        }

        // set 7 -- 3
        //console.log("7777")
        temp=0;
        while(temp<3){
            let chess7=Math.floor(Math.random() * 39);
            if(!board.includes(chess7)){
                board[32+temp]=chess7;
                temp++;
            }
        }


        // set 6 -- 4
        //console.log("6666")
        temp=0;
        while(temp<4){
            let chess6=Math.floor(Math.random() * 39);
            if(!board.includes(chess6)){
                board[28+temp]=chess6;
                temp++;
            }
        }



        // set 3 -- 5
        temp=0;
        while(temp<5){
            let chess3=this.getFirstFreePos(board);
            board[15+temp]=chess3;
            temp++;
        }
        //console.log(board);
        // set 4 -- 4

        temp=0;
        while(temp<4){
            let chess4=this.getFirstFreePos(board);
            board[20+temp]=chess4;
            temp++;
        }

        // set 5 -- 4

        temp=0;
        while(temp<4){
            let chess5=this.getFirstFreePos(board);
            board[24+temp]=chess5;
            temp++;
        }


        for(let i=0;i<40;i++){
            board[i]=39-board[i];
        }
        return board;
    },

    getFirstFreePos(board){
        let i=0;
        while(i<40){
            if(!board.includes(i)){
                return i;
            }
            i++;
        }
        return undefined;

    }
}