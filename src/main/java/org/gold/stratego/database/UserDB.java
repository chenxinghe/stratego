package org.gold.stratego.database;
import org.gold.stratego.database.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.security.MessageDigest;
import java.util.Arrays;

/**
 * Wrapper for Spring's UserRepository
 * @author Jacob Thomas
 */
@Transactional
@Component
public class UserDB{
    /**
     * Enum used to check the result of a login attempt in method authenticateUser()
     */
    public enum UserAuthenticationStatus {
        USERNAME_NOT_FOUND,
        INVALID_PASSWORD,
        SUCCESSFUL
    }


    /**
     * Cannot be used as a username for registered users.
     */
    private static String[] reserved = {
            "Anonymous"
    };


    @Autowired
    private UserRepository userRepository;

    /**
     * Attempts to authenticate the given username and password
     * @param username
     * @param password
     * @return - One of three statuses (defined above as enum):
     *          USERNAME_NOT_FOUND - The username is not present in the database.
     *          INVALID_PASSWORD - Username was found, but password does not match.
     *          SUCCESSFUL - Username and password exist in the DB.
     */
    public UserAuthenticationStatus authenticateUser(String username, String password){
        User found = findUser(username);
        if (found == null)
            return UserAuthenticationStatus.USERNAME_NOT_FOUND;
        byte[] db_hash = found.getPass_hash();
        byte[] user_hash = getHash(password);
        if (!Arrays.equals(db_hash, user_hash))
            return UserAuthenticationStatus.INVALID_PASSWORD;
        return UserAuthenticationStatus.SUCCESSFUL;

    }

    /**
     * Attempts to insert a new user into the UserDB
     * @param username
     * @param password
     * @return - true if insertion was successful
     *           false if insertion failed. Insertion can fail if: username already exists
     *                                                             or
     *                                                             username is a reserved word.
     */
    public Boolean insertUser(String username, String password){

        if (findUser(username) != null || isReserved(username)){
            return false;
        }

        User user = new User();
        user.setUsername(username);
        user.setPass_hash(getHash(password));
        userRepository.save(user);
        return true;

    }

    public User findUser(String username){
        List<User> results = userRepository.findUserByUsername(username);
        if (results.size() == 0)
            return null;
        return results.get(0);
    }

    public void updateUser(User user){
        userRepository.save(user);
    }

    public void deleteUser(String username){
        userRepository.deleteByUsername(username);
    }


    /**
     * Hashes the given string.
     */
    public byte[] getHash(String entry){
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(entry.getBytes());
            return md.digest();
        } catch (Exception e){
            System.out.println("Exception occurred while hashing password.");
            return null;
        }
    }

    /**
     * Checks if the username is in the list of reserved names.
     */
    private boolean isReserved(String username){
        List<String> reslist = Arrays.asList(reserved);
        return reslist.contains(username);
    }

    /**
     * Do not use this in the main code!
     * For debugging/testing only.
     *
     */
    public UserRepository DEBUG_getUserRepository(){
        return userRepository;
    }




}