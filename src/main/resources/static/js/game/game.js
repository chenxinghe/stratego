/*
 *@author Zihao Zheng
 */

/*
 * This is where Stratego game start.
 */

IMAGE_PATH = [
    "/img/cards_w.png",
    "/img/cards_b.png"
]

/*
*   Pre-LoadImage
*/
var ImageObjs = new Map();
var locker = 0;
function preLoad(stratego, btnSetup) {
    for (let i = 0; i < IMAGE_PATH.length; i++){
        locker ++;
        var imageObj = new Image();
        imageObj.src = IMAGE_PATH[i];
        ImageObjs.set(IMAGE_PATH[i], imageObj);
        imageObj.onload = function () {
            locker--;
            if (locker == 0) {
                stratego.init(ImageObjs);
            }
        }
    }
}

 class Stratego {

    init(ImageObjs){
        this.player1 = new Player(1);
        this.player1.isTurn = false;
        this.player2 = new Player(2);
        this.player2.isTurn = true;
        this.ai = new AI(this);
        this.isWin = false;

        this.imageObjs = ImageObjs;
        this.canvas = $("#canvas_cb")[0];
        this.chessPieces = new ChessPieces();
        this.chessBoardData = new Array(10);
        this.painter = new Painter(this);


        this.initChessBoardData();
        this.initButton();

        let stratego = this;

        $.get("/game/is_continue", function(result){
            if(result.success == "true"){
                $.get("/rest/get_active", function(game){
                    console.log(game);
                    let total_turns = game.turns.length;
                    Tools.convert2DServer12local(game.turns[total_turns - 1].board, stratego.chessBoardData, stratego.chessPieces);
                    // 0 is player1 turn, 1 is player2 turn
                    if (game.turns[total_turns - 1].player == 2){
                        stratego.player1.isTurn = false;
                        stratego.player2.isTurn = true;
                    }else{
                        stratego.player1.isTurn = true;
                        stratego.player2.isTurn = false;
                        stratego.ai.aiMove();
                    }
                    $("#setup").prop("disabled", true);
                    $("#start").prop("disabled", true);
                    $("#newgame").prop("disabled", false);
                    $("#quickmove").prop("disabled", false);
                    stratego.canvesSetPlayMod()
                    stratego.painter.draw();
                })
            }
        })
        this.painter.draw();
    };

    reset(){
        this.player1 = new Player(1);
        this.player1.isTurn = false;
        this.player2 = new Player(2);
        this.player2.isTurn = true;
        this.initChessBoardData();
        this.painter.draw();
    }

    initButton(){
        let stratego = this;
        let chessBoardData = this.chessBoardData;
        let cell_w = this.painter.cell_w, cell_h = this.painter.cell_h;;
        $("#setup").prop("disabled", false);
        //select function

        /*
        * setup: random the pieces on board, and allow player to switch piece
        * but not allow player to move piece
        */
        $("#setup").on("click", function (){
            $("#start").prop("disabled", false);
            $("#newgame").prop("disabled", false);
            stratego.initChessBoardData();
            stratego.chessPieces.init(chessBoardData);
            stratego.painter.draw();
            stratego.canvesSetSecletMode();
        });

        $("#start").on("click", function() {
            $("#setup").prop("disabled", true);
            $("#start").prop("disabled", true);
            $("#newgame").prop("disabled", false);
            $("#quickmove").prop("disabled", false);
            stratego.canvesSetPlayMod()
            stratego.postStart();
            stratego.postTurn();
        });

        $("#quickmove").on("click", function (){
            if (stratego.player2.isTurn){
                let result = stratego.ai.aiHelp();
                if ( result == "TURN_END"){
                    setTimeout(function(){
                        result =  stratego.ai.aiMove();
                        stratego.gameover(result);
                    }, 500);
                    // stratego.painter.draw();
                }
                stratego.gameover(result);
            }
        });

        $("#newgame").on("click", function (){
            $("#setup").prop("disabled", false);
            $("#newgame").prop("disabled", true);
            $("#start").prop("disabled", true);
            $("#quickmove").prop("disabled", true);
            $("#canvas_cb").off("click");
            stratego.postGameEnd(stratego.isWin ? "WIN" : "LOSS");
            stratego.reset();
        });
    }

    canvesSetSecletMode (){
        let stratego = this;
        let chessBoardData = this.chessBoardData;
        let cell_w = this.painter.cell_w, cell_h = this.painter.cell_h;;
        $("#canvas_cb").off("click");

        $("#canvas_cb").on('click', function (e){
            let x = Math.ceil(e.offsetX/cell_w) - 1, y = Math.ceil(e.offsetY/cell_h) - 1;
            stratego.select(x, y);
            if (stratego.player2.lastSelectPiece != undefined){
                stratego.switchPiece(stratego.player2.lastSelectPiece, stratego.player2.selectPiece);
                stratego.player2.deSelect();
            }
            stratego.painter.draw();
        });
    }

    canvesSetPlayMod(){
        let stratego = this;
        let chessBoardData = this.chessBoardData;
        let cell_w = this.painter.cell_w, cell_h = this.painter.cell_h;
        $("#canvas_cb").off("click");
        $("#canvas_cb").on("click", function (e) {
            let x = Math.ceil(e.offsetX / cell_w) - 1, y = Math.ceil(e.offsetY / cell_h) - 1;
            if (chessBoardData[y][x] !== undefined && chessBoardData[y][x].team == 2) {
                stratego.select(x, y);
                stratego.painter.draw();
            }
            if (stratego.player2.isTurn && (chessBoardData[y][x] === undefined || chessBoardData[y][x].team == 1) && stratego.player2.isSelect == true) {
                let result = stratego.moveChessPiece(stratego.player2, x, y);
                if (result == "TURN_END"){
                    setTimeout(function(){
                        result = stratego.ai.aiMove();
                        stratego.gameover(result);
                    }, 500);

                }
                stratego.gameover(result);
            }
        });
    }

    initChessBoardData(){
        for (let y = 0; y < 10; y++){
            this.chessBoardData[y] = new Array(10);
            for(let x = 0; x < 10; x++){
                this.chessBoardData[y][x] = undefined;
            }
            if(y == 4 || y == 5){
                this.chessBoardData[y][2] = "water"
                this.chessBoardData[y][3] = "water"
                this.chessBoardData[y][6] = "water"
                this.chessBoardData[y][7] = "water"
            }
        };
    };

     switchTurn(){
        if(this.player1.isTurn == true){
            this.player1.isTurn = false;
            this.player2.isTurn = true;
        }else{
            this.player1.isTurn = true;
            this.player2.isTurn = false;
        }
    }

    moveChessPiece(player, x, y){
        let sPiece = player.selectPiece;
        if (sPiece.pos.x != x && sPiece.pos.y != y){
            return "Invalid Move";
        }
        switch(sPiece.rank){
            case 0:
                return "Invalid Move";
                break;
            case 2:
                if (sPiece.pos.x != x){
                    let index = sPiece.pos.x > x ? sPiece.pos.x : x;
                    let d = sPiece.pos.x > x ? -1 : 1;
                    for ( let i = sPiece.pos.x + d; i != x; i = i + d){
                        if(this.chessBoardData[y][i] !== undefined) return "Invalid Move";
                    }
                }else if (sPiece.pos.y != y){
                    let index = sPiece.pos.y > y ? sPiece.pos.y : y;
                    let d = sPiece.pos.y > y ? -1 : 1;
                    for ( let i = sPiece.pos.y + d; i != y; i = i + d){
                        if(this.chessBoardData[i][x] !== undefined) return "Invalid Move";
                    }
                }
                break;
            case 11:
                return "Invalid Move";
                break;
            default:
                if (Math.abs(sPiece.pos.x - x ) > 1 || Math.abs(sPiece.pos.y - y ) > 1){
                    return "Invalid Move";
                }
                break;
        }



        player.lastMove.set(sPiece.pos, new Point(x, y));

        let result = "";
        if (this.chessBoardData[y][x] !== undefined){
            result = sPiece.attack(this.chessBoardData[y][x]);
            switch (result) {
                case "KILL":
                    this.chessPieces.removePiece(this.chessBoardData, this["player" + this.chessBoardData[y][x].team], this.chessBoardData[y][x])
                    break;
                case "KILLED":
                    this.chessPieces.removePiece(this.chessBoardData, this["player" + sPiece.team], sPiece)
                    break;
                case "WIN":
                    this.chessPieces.removePiece(this.chessBoardData, this["player" + this.chessBoardData[y][x].team], this.chessBoardData[y][x])
                    if (sPiece.team == 2 ){
                        result =  "WIN";
                    }else{
                        result = "LOSS";
                    }
                    break;
                default:
                    this.chessPieces.removePiece(this.chessBoardData, this["player" + this.chessBoardData[y][x].team], this.chessBoardData[y][x])
                    this.chessPieces.removePiece(this.chessBoardData, this["player" + sPiece.team], sPiece)
                    break;
            }
        }
        if(this.chessBoardData[sPiece.pos.y][sPiece.pos.x] !== undefined){
            this.chessBoardData[sPiece.pos.y][sPiece.pos.x] = undefined;
            this.chessBoardData[y][x] = sPiece;
            player.selectPiece.pos.setXY(x, y);
            player.selectPos.setXY(x, y);
        }
        this.painter.draw();

        let moveable_piece_num = [0, 0];
        for (let r = 1; r < 11; r ++){
            moveable_piece_num[0] += this.chessPieces.team1[r].length;
            moveable_piece_num[1] += this.chessPieces.team2[r].length;
        }
        if(moveable_piece_num[0] == 0){
            result = "WIN";
        }else if (moveable_piece_num[1] == 0){
            result = "LOSS";
        }

        this.switchTurn();
        this.postTurn();
        if (result == "WIN" || result == "LOSS"){
            return result;
        }
        return "TURN_END";
    }

    gameover(result){
        if(result == "WIN" || result == "LOSS"){
            $("#canvas_cb").off("click");
            $("#quickmove").prop("disabled", true);
            this.painter.draw();
            this.postGameEnd(result);
            this.isWin = result == "WIN" ? true : false;
            alert(result);
        }
    }

     select (x, y) {
         if (this.chessBoardData[y][x] !== undefined && this.chessBoardData[y][x].team == 2){
             this.player2.isSelect = true;
             this.player2.lastSelectPos.assign(this.player2.selectPos);
             this.player2.lastSelectPiece = this.player2.selectPiece;
             this.player2.selectPos.setXY(x, y);
             this.player2.selectPiece = this.chessBoardData[y][x];
         }
     }

    switchPiece(piece1, piece2){
        let pos1 = piece1.pos;
        let pos2 = piece2.pos;
        piece1.pos = pos2;
        piece2.pos = pos1;this.chessBoardData[piece1.pos.y][piece1.pos.x] = piece1;
        this.chessBoardData[piece2.pos.y][piece2.pos.x] = piece2;
        return;
    }

     postStart(){
        let game =JSON.stringify(Tools.createGameServerOjb(this)) //return json type game
        $.ajax({
            url: '/rest/save_game',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            // async: false,
            data: game
        });
    }


 // /set_game_result
    postTurn(playerTurn){
        let turn = JSON.stringify(Tools.createTurnServerOjb(this))
        $.ajax({
            url: '/rest/add_turn',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            // async: false,
            data: turn
        });

        let lp = JSON.stringify(Tools.createPiecesLeftServerOjb(this))
        $.ajax({
            url: '/rest/set_left_pieces',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            // async: false,
            data: lp
        });
    }
    postGameEnd(result){
        $.post("/rest/set_game_result", {result: result}, function (result){})
    }
}

 var Game ={
    start : function (){
        var stratego = new Stratego();
        preLoad(stratego);
    }
 }


