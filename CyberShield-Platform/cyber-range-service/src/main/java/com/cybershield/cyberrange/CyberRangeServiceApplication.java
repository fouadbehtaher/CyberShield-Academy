package com.cybershield.cyberrange;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CyberRangeServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CyberRangeServiceApplication.class, args);
    }
}
