package com.cybershield.gameengine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class GameEngineServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GameEngineServiceApplication.class, args);
    }
}
