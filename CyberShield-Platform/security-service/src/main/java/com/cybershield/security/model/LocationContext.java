package com.cybershield.security.model;

public record LocationContext(String countryCode, String ipAddress, boolean allowed) {
}
