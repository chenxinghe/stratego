package org.gold.stratego.database;
import org.gold.stratego.database.GameRepository;
import org.gold.stratego.database.entities.Game;
import org.gold.stratego.database.entities.Turn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Transactional
@Component
public class GameDB{

    @Autowired
    public GameRepository repo;

    /**
     * Gets the currently active game for the given user.
     * @param username
     * @return Game with key-value: "finished" = "false"
     *         Null if no active games
     *         or
     *         user is Anonymous
     */
    public Game getActiveGame(String username){
        if (username.equals("Anonymous"))
            return null;
        List<Game> games = repo.findActive(username);
        if (games.size() == 0)
            return null;
        return games.get(0);
    }

    /**
     * Finds all games associated with the current user's game history.
     * @param username
     * @return List of Game objects
     */
    public List<Game> findAllGames(String username){
        if (username.equals("Anonymous"))
            return null;
        List<Game> games = repo.findByUsername(username);
        return games;
    }

    /**
     * Returns all inactive games for the user 'username'
     */
    public List<Game> findAllInactiveGames(String username){
        if (username.equals("Anonymous"))
            return null;
        List<Game> inactive_games = repo.findInactive(username);
        return inactive_games;
    }

    /**
     * Returns game associated with id
     */
    public Game getGameById(String id){
        Optional<Game> game = repo.findById(id);
        if (game.isPresent())
            return game.get();
        return null;
    }

    /**
     * Updates the game in the Game DB
     * @param game
     */
    public void updateGame(Game game){
        repo.save(game);
    }

    public void addGame(Game game){
        DateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        Date date = new Date();
        String date_string = df.format(date);
        //System.out.println(date_string);
        game.setTime(date_string);
        repo.save(game);
    }





}