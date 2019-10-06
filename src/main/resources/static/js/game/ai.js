class AI{
    constructor(stratego){
        this.stratego = stratego;
    }

    aiHelp(){
        console.log("player turns");
        let board=this.stratego.chessBoardData;
        //console.log("enter auto move")
        let mov_arr =  this.findMovablePieces(this.stratego.chessBoardData,2);
        if(mov_arr.length<1){
            return false;
        }
        //console.log("auto move"+mov_arr)
        let result = this.makeGuesses(mov_arr,this.stratego.chessBoardData,2);
        let des= result.origin;
        let ox=des.pos.x;
        let oy=des.pos.y;
        let go=result.des;
        let dx=ox;
        let dy=oy;


        if(go=="top"&&des.rank==2){
            let gg=1;
            while(board[oy-gg][ox]!="water"&&board[oy-gg][ox]==undefined&&(oy-gg)>=0){
                if(oy-gg==0){
                    dy=0;
                    dx=ox;
                    break;
                }
                gg++;
            }
            if(board[oy-gg][ox]!==undefined&&board[oy-gg][ox].team==1){
                dy=oy-gg;
            }else{
                dy=oy-1;
            }

        }else{
            if(go=="top"){
                dx=ox;
                dy=oy-1;
            }else if(go=="bot"){
                dx=ox;
                dy=oy+1;
            }else if(go=="left"){
                dx=ox-1;
                dy=oy;
            }else if(go=="right"){
                dx=ox+1;
                dy=oy;
            }else{
                console.log("wrong des pass through: "+go)
            }
        }

        this.select(ox,oy,this.stratego.player2);
        return this.stratego.moveChessPiece(this.stratego.player2, dx, dy);
        //this.stratego.switchTurn();

    }


    aiMove(){
        console.log("AI turn starts")
        let mov_arr =  this.findMovablePieces(this.stratego.chessBoardData,1);
        if(mov_arr.length<1){
            return false;
        }
        let board=this.stratego.chessBoardData;
        //ai make a move
        let result = this.makeGuesses(mov_arr,this.stratego.chessBoardData,1);
        let des= result.origin;
        let ox=des.pos.x;
        let oy=des.pos.y;
        let go=result.des;
        let dx=ox;
        let dy=oy;

        if(go=="bot"&&des.rank==2){
            let gg=1;
            while(board[oy+gg][ox]!="water"&&board[oy+gg][ox]==undefined&&(oy+gg)<=9){
                if(oy+gg==9){
                    dy=9;
                    dx=ox;
                    break;
                }
                gg++;
            }
            if(board[oy+gg][ox].team==2){
                dy=oy+gg;
            }else{
                dy=oy+1;
            }

        }else{
            if(go=="top"){
                dx=ox;
                dy=oy-1;
            }else if(go=="bot"){
                dx=ox;
                dy=oy+1;
            }else if(go=="left"){
                dx=ox-1;
                dy=oy;
            }else if(go=="right"){
                dx=ox+1;
                dy=oy;
            }else{
                console.log("wrong des pass through: "+go)
            }
        }




        // //move a test random move
        // let ran=Math.floor(Math.random()*mov_arr.length)
        // let result=mov_arr[ran]
        // console.log(result);
        // let des= result.origin;
        // console.log("des"+des);
        // let ox=des.pos.x;
        // let oy=des.pos.y;
        // let dx=ox;
        // let dy=oy;
        // if(result.below!==null){
        //     dx=ox;
        //     dy=oy+1;
        // }else if(result.above!==null){
        //     dx=ox;
        //     dy=oy-1;
        // }else if(result.left!==null){
        //     dx=ox-1;
        //     dy=oy;
        // }else{
        //     dx=ox+1;
        //     dy=oy;
        // }

        this.select(ox,oy,this.stratego.player1);
        return this.stratego.moveChessPiece(this.stratego.player1, dx, dy);

    }

    select (x, y,player) {
        let stratego= this.stratego;
        if (stratego.chessBoardData[y][x] != null && stratego.chessBoardData[y][x].team ==player.id){
            player.isSelect = true;
            player.lastSelectPos.assign(player.selectPos);
            player.lastSelectPiece = player.selectPiece;
            player.selectPos.setXY(x, y);
            player.selectPiece =stratego.chessBoardData[y][x];
        }
    }





    makeGuesses(movableArr,board,teamNum){
        //calculate all the score in the minmax array
        let tar=0;
        for (let i =0; i<movableArr.length;i++){
            let temp=this.calScore(movableArr[i],board,teamNum);
            movableArr[i].score=temp.score;
            movableArr[i].des=temp.des;
        }
        console.log("score array is here")
        console.log(movableArr)
        let max=movableArr[0].score;
        let result=new Array();
        result.push(movableArr[0])
        //get max score in the minmax array
        for(let j=1;j<movableArr.length;j++){
            if(movableArr[j].score>max){
                max=movableArr[j].score;
                result=[];
                result[0]= movableArr[j];
            }else if(movableArr[j].score==max){
                result.push(movableArr[j]);
            }
        }
        //console.log("result array is here: "+result);
        result.sort(function(){return Math.random()>0.5?-1:1;});
        let randomNum=Math.floor(Math.random()*result.length)
        if(Math.random()>0.5){
            let temp=0;
            if(teamNum==1){
                while(temp<result.length){
                    if(result[temp].des=="bot"){
                        tar = result[temp];
                    }
                    temp++;
                }
            }else{
                while(temp<result.length){
                    if(result[temp].des=="top"){
                        tar = result[temp];
                    }
                    temp++;
                }
            }
        }

        if(tar==0){

            tar=result[randomNum]
        }

        // let flag=this.getTeamFlag(2);
        // console.log("flag is at:"+flag.x+"--"+flag.y);
        // console.log("tar is :"+tar);
        // if(tar.score<=1){
        //     if(tar.left!==null&&tar.origin.pos.x>flag.x){
        //         tar.des="left";
        //     }else if(tar.right!==null&&tar.origin.pos.x<flag.x){
        //         tar.des="right";
        //     }else if(tar.bot!==null&&tar.origin.pos.y>flag.y){
        //         tar.des="bot";
        //     }else if(tar.top!==null&&tar.origin.pos.y<flag.y){
        //         tar.des="top";
        //     }
        //
        // }

        return tar;

    }

    getTeamFlag(teamNum){
        let a=0;
        let b=0;
       //console.log(this.stratego.chessPieces.team2[11])
        if(teamNum==1){
            a=this.stratego.chessPieces.team1[11][0].pos.x
            b=this.stratego.chessPieces.team1[11][0].pos.y
        }else{
            a=this.stratego.chessPieces.team2[11][0].pos.x
            b=this.stratego.chessPieces.team2[11][0].pos.y
        }
        return {x:a,y:b}


    }


    /*寻找所有棋子，可移动棋子加入array */
    findMovablePieces(board,teamNum){
        let movable_pieces = new Array();
        for (let y = 0 ; y < 10; y++){
            for(let x = 0 ; x < 10; x++){
                //console.log(y+"--"+x);
                if(board[y][x]!=undefined  && board[y][x]!="water" && board[y][x].team!=(3-teamNum) && board[y][x].movetype!=0){
                    //console.log("enter if")
                    let temp={origin: board[y][x]};
                    if(y>0){
                        if(this.movablePieces(board[y-1][x],y-1,x,teamNum)){
                            temp.above=board[y-1][x];
                        }else{
                            temp.above=null;
                        }
                    }else{
                        temp.above=null;
                    }

                    if(y<9){
                        if(this.movablePieces(board[y+1][x],y+1,x,teamNum)){
                            temp.below=board[y+1][x];
                        }else{
                            temp.below=null;
                        }
                    }else{
                        temp.below=null;
                    }


                    if(x>0){
                        if(this.movablePieces(board[y][x-1],y,x-1,teamNum)){
                            temp.left=board[y][x-1];
                        }else{
                            temp.left=null;
                        }
                    }else{
                        temp.left=null;
                    }

                    if(x<9){
                        if(this.movablePieces(board[y][x+1],y,x+1,teamNum)){
                            //console.log("right side add pieces")
                            temp.right=board[y][x+1];
                        }else{
                            temp.right=null;
                        }
                    }else{
                        temp.right=null;
                    }


                    if( temp.above !== null||temp.below !== null||temp.left !== null||temp.right !== null ){
                        //console.log(" push pieces into movable pieces")
                        movable_pieces.push(temp);
                    }
                }
            }
        }
        return movable_pieces;
    }


    movablePieces(target,y,x,teamNum){
        if (x < 0 || y <0 || x > 9 || y > 9){
            return false;
        }
        if (target == undefined){
            return true;
        }else if (target == "water"){
            return false;
        }else if (target.team == teamNum){
            return false
        }else{
            return true;
        }


    }
    // 保护国旗移动加分。
    // 分数小要逃跑
    // 冲锋： 对面棋子却大分数越高   对棋子分类{
    // 分数/2.5
    // 踩地雷   	  -1
    //
    // 优先级：
    // 1.间谍：8
    // 2.冲锋  1
    // 3.工兵  4     最后一个和对手地雷不小于1变为     7
    //
    // 4    3
    // 5    4
    // 6    5
    // 7    6
    // 8    7
    // 9    8
    // 10司令   10
    // B炸弹    7
    // F国旗    999

    calScore(target,board,teamNum){
        let top = new Array();
        let bot = new Array();
        let left = new Array();
        let right= new Array();
        let L_top,L_bot,R_top,R_bot;
        let temp_x = target.origin.pos.x;
        let temp_y = target.origin.pos.y;

        if(target.origin.rank === 2 && target.below !== null){
            let i= temp_y
            for (; i < 9; i++){
                if(board[i+1][temp_x] !== undefined){
                    if(board[i+1][temp_x] === "water"){
                        break;
                    }
                    else if(board[i+1][temp_x].team === 2){
                        let dic = {score:this.chargerScore(board[i+1][temp_x]),des:"bot"};
                        return dic;
                    }
                }
            }
        }


        if (target.above !== null){
            let above_x = temp_x;
            let above_y = temp_y -1;

            top[0] =  this.comparePieces(target,target.above);
            if ( above_y > 0 && this.movablePieces(board[above_y-1][above_x],above_y -1,above_x,teamNum)) {
                top[1] = this.comparePieces(target,board[above_y-1][above_x]);
            }
            if ( above_x > 0 && this.movablePieces(board[above_y][above_x - 1],above_y,above_x -1,teamNum)){
                if (board[above_y][above_x - 1] !== undefined)
                    L_top = board[above_y][above_x - 1];
                else
                    L_top = undefined;

                top[2] = this.comparePieces(target,L_top);
            }

            if ( above_x < 8 && this.movablePieces(board[above_y][above_x + 1],above_y,above_x+ 1,teamNum)){
                if (board[above_y][above_x + 1] !== undefined)
                    R_top = board[above_y][above_x + 1];
                else
                    R_top = undefined;
                top[3] = this.comparePieces(target,R_top);
            }
        }
        if(target.below !== null){
            let below_x = temp_x;
            let below_y = temp_y + 1;
            bot[0] =  this.comparePieces(target,target.below);
            if ( below_y < 8  && (this.movablePieces(board[below_y+1][below_x],below_y +1,below_x,teamNum)) ) {
                bot[1] = this.comparePieces(target,board[below_x][below_y+1]);
            }
            if (below_x > 1 && this.movablePieces(board[below_y][below_x - 1],below_y,below_x-1,teamNum)){
                if (board[below_y][below_x - 1] !== undefined)
                    L_bot = board[below_y][below_x - 1];
                else
                    L_bot = undefined;

                bot[2] = this.comparePieces(target,L_bot);
            }

            if (below_x < 8 && this.movablePieces(board[below_y][below_x +1],below_y,below_x+1,teamNum)){
                if (board[below_y][below_x + 1] != undefined)
                    R_bot = board[below_y][below_x + 1];
                else
                    R_bot = undefined;
                bot[3] = this.comparePieces(target,R_bot);
            }
        }
        if (target.left !== null){
            let left_x = temp_x -1;
            let left_y = temp_y;
            left[0] = this.comparePieces(target,board[left_y][left_x]);
            if (left_x > 0 && this.movablePieces(board[left_y][left_x -1],left_y,left_x-1,teamNum)){
                left[1] = this.comparePieces(target,board[left_y][left_x-1]);
            }
            left[2] = bot[2];
            left[3] = top[2];
        }
        if (target.right !== null){
            let right_x = temp_x +1;
            let right_y = temp_y;
            right[0] = this.comparePieces(target,board[right_y][right_x]);
            if (right_x < 8  && this.movablePieces(board[right_y][right_x+1],right_y,right_x+1,teamNum)){
                right[1] = this.comparePieces(target,board[right_y][right_x+1]);
            }
            right[2] = bot[3];
            right[3] = top[3];
        }



        let right_score = {score:this.count_sorce(right),des:"right"};
        let left_score= {score:this.count_sorce(left),des:"left"};
        let top_score= {score:this.count_sorce(top),des:"top"};
        let bot_score= {score:this.count_sorce(bot),des:"bot"};

        let list_score = [right_score,left_score,top_score,bot_score];
        list_score.sort(function(){return Math.random()>0.5?1:-1;});
        list_score.sort((b, a) => (a.score > b.score) ? 1 : -1);

        return list_score[0];


        // let dic={score: -999, des: null}
        // if (top_score > bot_score){
        //     if (top_score > left_score){
        //         if (top_score  > right_score){
        //             dic = {score:top_score,des:"top"};
        //         }else {
        //             dic = {score:right_score,des:"right"};
        //         }
        //     }else {
        //         if (left_score > right_score){
        //             dic = {score:left_score,des:"left"};
        //         }else {
        //             dic = {score:right_score,des:"right"};
        //         }
        //     }
        //     return dic;
        // }else{
        //     if (bot_score > left_score){
        //         if (bot_score > right_score){
        //             dic = {score:bot_score,des:"bot"};
        //         }else {
        //             dic = {score:right_score,des:"right"};
        //         }
        //     }else {
        //         if (left_score > right_score){
        //             dic = {score:left_score,des:"left"};
        //         }else {
        //             dic = {score:right_score,des:"right"};
        //
        //         }
        //     }
        //     return dic;
        // }

    }

    count_sorce(arr){
        let temp = -999;
        for (let i in arr){
            if (arr[i]< 0 && arr[i]!==undefined)
                return arr[i];
            if (temp < arr[i])
                temp = arr[i];
        }
        return temp;

    }


    comparePieces(att,def) {
        if (def === undefined)
            return 0;
        if (def.rank === 0 && att.rank !== 3){
            return 0;
        }
        if (att.rank === 3 &&  def.rank === 0){
            return 5;
        }
        if (att.origin.rank === 1 && def.rank === 10){
            return 11;
        }
        if (def.rank === 11){
            return 999;
        }
        if (att.origin.rank > def.rank)
            return def.rank;
        if (att.origin.rank < def.rank)
            return -att.rank-1;
        else{
            return 0;
        }

    }

    chargerScore(target){
        if (target.rank === 0){
            return -1;
        }
        else if (target.rank === 11){
            return 999;
        }
        else if (target.rank === 1){
            return  8;
        }
        else
            return target.rank/2.5;
    }
























































































}