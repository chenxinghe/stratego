package org.gold.stratego;

import org.gold.stratego.database.UserRepository;
import org.gold.stratego.database.entities.User;
import org.gold.stratego.database.entities.MongoTest;
import org.gold.stratego.database.entities.MongoTest.ObjectTest;
import org.junit.Test;
import org.junit.After;
import org.junit.runner.RunWith;
import static org.junit.Assert.*;

import org.omg.PortableInterceptor.SUCCESSFUL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.ContextConfiguration;
import org.gold.stratego.database.UserDB;
import org.gold.stratego.database.GameRepository;
import org.gold.stratego.database.UserDB.UserAuthenticationStatus;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.ApplicationContext;


import java.util.ArrayList;
import java.util.Random;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DemoApplicationTests {

    @Autowired
    private UserDB userDB;

    @Autowired
    private UserRepository userRepository;

	@Autowired
	private GameRepository gr;

	//store all the test users we make here so we can delete afterwards.
    private ArrayList<String> testusernames = new ArrayList();

	@Test
	public void contextLoads() {
	}

	/**
	 * Tests initialization of the UserDB wrapper on the Spring userRepository
	 */
	@Test
	public void DB_InitTest(){
	    //Ensure the repository beans are correctly loaded by Spring.
	    assertNotNull(userDB);
	    assertNotNull(userRepository);
	    assertNotNull(gr);
	}

	/**
	 * Ensures reserved names are not entered into DB.
	 */
	@Test
	public void DB_ReservedTest(){
		String username = "Anonymous";
		String password = "123";
		assertFalse(userDB.insertUser(username, password));
	}

    /**
     * Test Create, Retrieve, Update, Delete functions for User DB.
     */
    //Test insertion
	@Test
    public void DB_CRUDTests(){
	    String username = generateRandomString();
	    testusernames.add(username);

	    String password = "test_user_password";

		userDB.insertUser(username, password);
        System.out.println("*** DB_CRUDTest: CREATE: Test user inserted.");

	    System.out.println("*** DB_CRUDTest: RETRIEVE: Retrieving test user...");
	    User found = userDB.findUser(username);
	    assertNotNull(found);
	    assertEquals(found.getUsername(), username);
	    System.out.println("*** DB_CRUDTest: RETRIEVE: Test user retrieved.");

	    found.setUsername(username.toUpperCase());
		testusernames.add(username.toUpperCase());
	    userDB.updateUser(found);
        System.out.println("*** DB_CRUDTest: UPDATE: Test user username updated.");
        User found_updated = userDB.findUser(username.toUpperCase());
        assertNotNull(found_updated);
        assertEquals(found_updated.getUsername(), username.toUpperCase());

        System.out.println("*** DB_CRUDTest: DELETE: Attempting to delete test user.");
        userDB.deleteUser(username.toUpperCase());
        assertNull(userDB.findUser(username.toUpperCase()));

    }

	/**
	 * Tests verification of login info.
	 */
	@Test
	public void DB_UserAuthenticationTest(){
		String username = generateRandomString();
		testusernames.add(username);

		String password = "this_is_A_PASSWORD!";
		userDB.insertUser(username, password);
		UserAuthenticationStatus status = userDB.authenticateUser(username, password);
		assertEquals(status, UserAuthenticationStatus.SUCCESSFUL);

		status = userDB.authenticateUser("This is the wrong username. And also not allowed.", password);
		assertEquals(status, UserAuthenticationStatus.USERNAME_NOT_FOUND);

		status = userDB.authenticateUser(username, "This is definitely the wrong password.");
		assertEquals(status, UserAuthenticationStatus.INVALID_PASSWORD);

	}

    /**
     * Expect exception when trying to add 2 users with duplicate usernames.
     */
	@Test
    public void DB_DuplicateUserTest(){
        String username = generateRandomString();
        testusernames.add(username);
        String password = "generic password";


            userDB.insertUser(username, password);
            assertFalse(userDB.insertUser(username, password));
    }



	/**
	 * Make sure all the test users we created are deleted after tests.
	 */
	@After
	public void deleteTestUsers(){
		for (String user: testusernames)
			userDB.deleteUser(user);
	}

	private String generateRandomString(){
		String base = "testUSER";
		Random rand = new Random();
		base = base + (new Integer(rand.nextInt(Integer.MAX_VALUE)).toString());
		return base;
	}
}
