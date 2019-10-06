package org.gold.stratego.database.entities;

import org.gold.stratego.database.entities.Turn;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.ArrayList;
import java.util.Arrays;
import org.gold.stratego.database.entities.Turn;

import static org.gold.stratego.database.entities.Game.COLLECTION_NAME;

/**
 * POJO implementation of MongoDB game data.
 * Refer to database/GameDB_format.json for data format
 * @author Jacob Thomas
 */

@Document(collection=COLLECTION_NAME)
public class Game {

    public static final String COLLECTION_NAME = "games";

    @Id
    private String id;
    private String username;
    private String finished;
    private String result;
    private String time;
    private int[] board_start;
    private int[][] pieces_left;
    private ArrayList<Turn> turns;

    public int[][] getPieces_left() {
        return pieces_left;
    }

    public void setPieces_left(int[][] pieces_left) {
        this.pieces_left = pieces_left;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public ArrayList<Turn> getTurns() {
        if (turns == null)
            turns = new ArrayList<Turn>();
        return turns;
    }

    public void setTurns(ArrayList<Turn> turns) {
        this.turns = turns;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public int[] getBoard_start() {
        return board_start;
    }

    public void setBoard_start(int[] board_start) {
        this.board_start = board_start;
    }
    public String getFinished() {
        return finished;
    }

    public void setFinished(String finished) {
        this.finished = finished;
    }

    @Override
    public String toString() {
        return "Game{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", finished='" + finished + '\'' +
                ", result='" + result + '\'' +
                ", board_start=" + Arrays.toString(board_start) +
                '}';
    }
}
