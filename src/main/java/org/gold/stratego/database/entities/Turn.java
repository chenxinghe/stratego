package org.gold.stratego.database.entities;

import java.util.Arrays;

/**
 * POJO implementation of MongoDB turn data.
 * Refer to database/GameDB_format.json for data format
 * @author Jacob Thomas
 */

public class Turn {

    private String player;
    private int[] board;
    private String piece_number;
    private String piece_action;
    private int[] move_location;
    private String piece_attacked;
    private int[] attack_location;
    private String[] pieces_lost;

    public String getPlayer() {
        return player;
    }

    public void setPlayer(String player) {
        this.player = player;
    }

    public int[] getBoard() {
        return board;
    }

    public void setBoard(int[] board) {
        this.board = board;
    }

    public String getPiece_number() {
        return piece_number;
    }

    public void setPiece_number(String piece_number) {
        this.piece_number = piece_number;
    }

    public String getPiece_action() {
        return piece_action;
    }

    public void setPiece_action(String piece_action) {
        this.piece_action = piece_action;
    }

    public int[] getMove_location() {
        return move_location;
    }

    public void setMove_location(int[] move_location) {
        this.move_location = move_location;
    }

    public String getPiece_attacked() {
        return piece_attacked;
    }

    public void setPiece_attacked(String piece_attacked) {
        this.piece_attacked = piece_attacked;
    }

    public int[] getAttack_location() {
        return attack_location;
    }

    public void setAttack_location(int[] attack_location) {
        this.attack_location = attack_location;
    }

    public String[] getPieces_lost() {
        return pieces_lost;
    }

    public void setPieces_lost(String[] pieces_lost) {
        this.pieces_lost = pieces_lost;
    }

    @Override
    public String toString() {
        return "Turn{" +
                "player='" + player + '\'' +
                ", board=" + Arrays.toString(board) +
                ", piece_number='" + piece_number + '\'' +
                ", piece_action='" + piece_action + '\'' +
                ", move_location=" + Arrays.toString(move_location) +
                ", piece_attacked='" + piece_attacked + '\'' +
                ", attack_location=" + Arrays.toString(attack_location) +
                ", pieces_lost=" + Arrays.toString(pieces_lost) +
                '}';
    }
}
