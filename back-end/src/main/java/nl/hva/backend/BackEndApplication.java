package nl.hva.backend;

import nl.hva.backend.utils.DummyDataGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@EnableJpaRepositories
public class BackEndApplication implements CommandLineRunner {

  @Value("${spring.profiles.active}")
  private String activeProfile;

  @Autowired
  private DummyDataGenerator dataGenerator;

  public static void main(String[] args) {
    SpringApplication.run(BackEndApplication.class, args);
  }

  /**
   * Allows for the ability to run code on start-up.
   *
   * @param args Automatically provided by Spring boot on start-up.
   */
  @Override
  public void run(String... args) {
    if (!activeProfile.equals("dev")) return;

    this.dataGenerator.createTestPlayers();
  }

}