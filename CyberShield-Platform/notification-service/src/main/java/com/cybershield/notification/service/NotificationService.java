package com.cybershield.notification.service;

import com.cybershield.notification.model.Notification;
import com.cybershield.notification.websocket.WebSocketService;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final WebSocketService webSocketService;

    public NotificationService(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    public void sendNotification(String userId, Notification notification) {
        webSocketService.sendToUser(userId, notification);
    }
}
