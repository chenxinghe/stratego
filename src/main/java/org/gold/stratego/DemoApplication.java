package org.gold.stratego;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.gold.stratego.database.UserRepository;
import org.gold.stratego.database.GameRepository;
import org.springframework.context.ApplicationContext;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;


import java.util.Arrays;

@SpringBootApplication
@EnableJpaRepositories(basePackageClasses={UserRepository.class})
@EnableMongoRepositories(basePackageClasses ={GameRepository.class})

public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
