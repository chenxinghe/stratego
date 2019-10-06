package org.gold.stratego.controller;


import org.gold.stratego.database.UserDB;
import org.gold.stratego.database.entities.User;
import org.gold.stratego.model.LoginInfo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

/**
 * Contains paths related to obtaining user session data.
 * and
 * methods related to manipulating user session attributes
 * @author Jacob Thomas
 */
@Controller
public class SessionController {


    /**
     * Use this to check if user is currently logged in
     *
     * @param session - user session
     * @return -  Username of the user if the user is logged in
     *            "Anonymous" if the user is not logged in
     *
     */
    @ResponseBody
    @GetMapping("/loadUserInfo")
    public String loadUserInfo(HttpSession session)throws Exception{

        if (session.getAttribute("name") == null)
            return "Anonymous";
        return session.getAttribute("name").toString();
    }

    /**
     * Returns MongoDB id of the unfinished Stratego game that the user is currently playing.
     * @param session - user session
     * @return id of current game if an unfinished game exists
     *         "null" if no game exists
     */
    @ResponseBody
    @GetMapping("/loadCurrentGame")
    public String loadCurrentGame(HttpSession session)throws Exception{
        Object currentGame = session.getAttribute("current_game");
        if (currentGame == null)
            return null;
        return currentGame.toString();
    }

    /**
     * Indicates if the user is logged in or not.
     * @return true if user is anonymous
     *         false is user is logged in
     */
    public boolean userIsAnonymous(HttpSession session) throws Exception{
        return loadUserInfo(session).equals("Anonymous");
    }

    /**
     * Sets an attribute current_game in the user session to indicate
     * that the user is currently playing an unfinished game.
     * @param id MongoDB id of current game
     *           or
     *           null to indicate the user has no games in progress (they just finished a game)
     */
    public void setCurrentGame(HttpSession session, String id) throws Exception{
        session.setAttribute("current_game", id);
    }

}