package org.gold.stratego.database.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * Table for each registered user
 * @param id - unique ID of each user
 * @param username - username of the user
 * @param password - hashed password of the user
 */
@Entity
public class User{
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;
    private String username;
    private byte[] pass_hash;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String name) {
        this.username = name;
    }

    public byte[] getPass_hash() {
        return pass_hash;
    }

    public void setPass_hash(byte[] pass_hash) {
        this.pass_hash = pass_hash;
    }
}