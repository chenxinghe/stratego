package org.gold.stratego.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import javax.servlet.http.HttpSession;

import org.gold.stratego.database.GameDB;
import org.gold.stratego.database.entities.MongoTest;
import org.gold.stratego.database.entities.Turn;
import org.gold.stratego.database.entities.Game;
import org.gold.stratego.controller.SessionController;

import java.util.*;

import javax.servlet.http.HttpServletRequest;

/**
 * Maps the REST endpoints for storing and retrieving game data.
 * @author Jacob Thomas
 */

@RestController
@RequestMapping(path="/rest")
public class GameRESTController{

    @Autowired
    SessionController sc;

    @Autowired
    GameDB gameDB;

    @Autowired
    org.gold.stratego.database.GameRepository repo;


    /**
     * Saves a Game into the GameDB
     * Only saves games if the user is logged in.
     * @param game - Object which will be set with JSON data in HTTP body.
     */
    @PostMapping(path="/save_game", consumes=MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> save_game(@RequestBody Game game, HttpSession session) throws Exception{
        if (sc.userIsAnonymous(session))
            return success(false, "User is anonymous");

        //If user starts a new game while another game is in progress,
        //set game as finished and set result to loss
        finalizeGameWithResult(session, "LOSS");

        //add current game to DB
        String username = sc.loadUserInfo(session);
        game.setFinished("false");
        game.setUsername(username);
        gameDB.addGame(game);

        Game active = gameDB.getActiveGame(username);
        //set active game id in session
        sc.setCurrentGame(session, active.getId());
        return success(true);
    }

    /**
     * Adds the turn data to the current active Game document. The ID of the current game is acquired from the
     * current session.
     * @param turn
     * @param session
     * @return Success if turn is successfully added to DB.
     *         Failure if user is anonymous
     *         or
     *         User has no active games
     */
    @PostMapping(path="/add_turn", consumes=MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> add_turn(@RequestBody Turn turn, HttpSession session) throws Exception{
        if (sc.userIsAnonymous(session))
            return success(false, "User is anonymous.");
        if (sc.loadCurrentGame(session) == null)
            return success(false, "No currently active game to add moves to.");
        String currentUser = sc.loadUserInfo(session);
        Game active = gameDB.getActiveGame(currentUser);
        if (active == null)
            return success(false, "No active games for current user: ");
        active.getTurns().add(turn);
        gameDB.updateGame(active);
        return success(true);

    }

    /**
     * Returns the active game for the logged in user if it exists
     * Null otherwise
     * @param session
     * @return Game object in JSON format
     *         Null if game does not exist
     */
    @GetMapping(path="/get_active")
    public Game get_active(HttpSession session)throws Exception{
        Game activeGame = gameDB.getActiveGame(sc.loadUserInfo(session));
        if (activeGame == null)
            return null;
        //Edit by Zee
        sc.setCurrentGame(session, activeGame.getId());
        return activeGame;
    }

    /**
     * Returns the active game for the logged in user if it exists
     * Null otherwise
     * @param session
     * @return
     */



    @PostMapping(path="/set_left_pieces", consumes=MediaType.APPLICATION_JSON_VALUE)
    public Map set_left_pieces(@RequestBody int[][] left_piece, HttpSession session)throws Exception{
        if (sc.userIsAnonymous(session))
            return success(false, "User is anonymous.");
        if (sc.loadCurrentGame(session) == null)
            return success(false, "No currently active game to add moves to.");
        String currentUser = sc.loadUserInfo(session);
        Game active = gameDB.getActiveGame(currentUser);
        if (active == null)
            return success(false, "No active games for current user: ");
        active.setPieces_left(left_piece);
        gameDB.updateGame(active);
        return success(true);
    }


    /**
     * Add by Zee
     * Sets active game result to WIN or LOSS, then marks the game inactive by setting
     * finished = "true"
     * @param result - WIN or LOSS
     * @param session
     * @return
     */
    @PostMapping(path="/set_game_result")
    public Map<String, String> set_game_result(@RequestParam("result") String result,
                                               HttpSession session) throws Exception{
        result = result.toUpperCase();
        if (!result.equals("WIN") && !result.equals("LOSS")){
            return success(false, "Invalid parameters, result can only be WIN or LOSS");
        }
        String currentUser = sc.loadUserInfo(session);
        Game active = gameDB.getActiveGame(currentUser);
        if (active == null)
            return success(false, "No active game for current user.");
        finalizeGameWithResult(session, result);
        return success(true);
    }

    /**
     * Returns all inactive games in the history of current logged in user.
     * @param session current session
     * @return Array of inactive Games in JSON format that are associated with current user
     *         Nothing if user is Anonymous.
     */
    @GetMapping(path="/get_games")
    public Iterable<Game> getUserGames(HttpSession session)throws Exception{
        Map<String, Object> hashMap = new HashMap<>();
        String username = sc.loadUserInfo(session);
        if (username.equals("Anonymous"))
            return null;
        return gameDB.findAllInactiveGames(username);
    }

    //Below methods are not endpoints.

    /**
     * Sets the status of the currently active game to WIN or LOSS, then marks
     * the game inactive.
     * Does nothing if there is no active game.
     * @param session
     * @param result - WIN or LOSS
     * @return - The modified Game object (just for debugging)
     */
    private Game finalizeGameWithResult(HttpSession session, String result) throws Exception{
        result = result.toUpperCase();
        //String id = sc.loadCurrentGame(session);
        Game game = gameDB.getActiveGame(sc.loadUserInfo(session));
        if (game == null)
            return null;
        //Set result to result param and mark game as finished
        //Game game = gameDB.getGameById(id);
        game.setResult(result);
        game.setFinished("true");
        gameDB.updateGame(game);

        //Remove game data from user session
        sc.setCurrentGame(session, null);

        return game;

    }

    /**
     * Creates the return object for REST methods to indicate success or failure
     * @param b - whether "success" = true or false
     * @return {success: true} or {success: false}
     */

    private static Map<String, String> success(Boolean b){
        Map<String, String> hashMap = new HashMap<>();
        hashMap.put("success", b.toString().toLowerCase());
        return hashMap;
    }

    private static Map<String, String> success(Boolean b, String details){
        Map<String, String> map = success(b);
        map.put("details", details);
        return map;
    }
}
