package com.cybershield.notification.websocket;

import com.cybershield.notification.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class WebSocketService {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketService.class);

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendToUser(String userId, Notification notification) {
        try {
            String destination = "/queue/notifications";
            messagingTemplate.convertAndSendToUser(userId, destination, notification);
            LOGGER.debug("Dispatched notification {} to user {}", notification.type(), userId);
        } catch (MessagingException ex) {
            LOGGER.warn("Failed to deliver notification {} to user {} via WebSocket: {}",
                    notification.type(), userId, ex.getMessage());
        }
    }
}
