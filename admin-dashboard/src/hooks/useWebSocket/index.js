import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * WebSocket management hook with optional auto-reconnect.
 *
 * @param {string} url - WebSocket endpoint.
 * @param {object} [options]
 * @param {boolean} [options.enabled=true] - Controls if the socket should be active.
 * @param {boolean} [options.autoReconnect=true] - Attempt reconnection when the socket closes unexpectedly.
 * @param {number} [options.reconnectInterval=5000] - Delay between reconnect attempts in ms.
 */
const useWebSocket = (url, { enabled = true, autoReconnect = true, reconnectInterval = 5000 } = {}) => {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const shouldReconnectRef = useRef(autoReconnect);

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const latestMessage = useMemo(() => (messages.length > 0 ? messages[messages.length - 1] : null), [messages]);

  const cleanupSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!url || !enabled) {
      return;
    }

    cleanupSocket();

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    socket.onerror = (event) => {
      setError(event);
    };

    socket.onclose = () => {
      setIsConnected(false);
      if (shouldReconnectRef.current && autoReconnect) {
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connect();
        }, reconnectInterval);
      }
    };

    socket.onmessage = (event) => {
      let parsedMessage = event.data;
      try {
        parsedMessage = JSON.parse(event.data);
      } catch (parseError) {
        // Keep raw string payload when JSON parsing fails.
      }
      setMessages((prev) => [...prev, parsedMessage]);
    };
  }, [url, enabled, autoReconnect, reconnectInterval, cleanupSocket]);

  useEffect(() => {
    shouldReconnectRef.current = autoReconnect;
    if (!enabled) {
      cleanupSocket();
      return undefined;
    }

    connect();

    return () => {
      shouldReconnectRef.current = false;
      cleanupSocket();
    };
  }, [autoReconnect, cleanupSocket, connect, enabled]);

  const sendMessage = useCallback((payload) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected.');
    }

    const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
    socketRef.current.send(message);
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return {
    isConnected,
    messages,
    latestMessage,
    error,
    sendMessage,
    clearMessages,
  };
};

export default useWebSocket;
