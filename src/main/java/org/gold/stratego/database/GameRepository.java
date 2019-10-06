package org.gold.stratego.database;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.gold.stratego.database.entities.Game;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

@Repository
public interface GameRepository extends MongoRepository<Game, String> {

    public List<Game> findByUsername(String username);

    @Query("{ 'username' : ?0 , 'finished' : 'false' }")
    public List<Game> findActive(String username);

    @Query("{ 'username' : ?0 , 'finished' : 'true' }")
    public List<Game> findInactive(String username);


}