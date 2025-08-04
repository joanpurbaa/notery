// src/utils/websocket.js
// Install dulu: npm install laravel-echo pusher-js

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Setup Laravel Echo untuk WebSocket
export const setupEcho = (token) => {
  window.Pusher = Pusher;

  window.Echo = new Echo({
    broadcaster: 'reverb',
    wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  return window.Echo;
};

// Subscribe to chat room
export const subscribeToChatRoom = (chatRoomId, onMessageReceived) => {
  if (!window.Echo) {
    console.error('Echo not initialized');
    return null;
  }

  const channel = window.Echo.private(`chat.${chatRoomId}`);
  
  channel.listen('MessageSent', (e) => {
    console.log('New message received:', e);
    if (onMessageReceived) {
      onMessageReceived(e);
    }
  });

  return channel;
};

// Unsubscribe from chat room
export const unsubscribeFromChatRoom = (chatRoomId) => {
  if (!window.Echo) return;
  
  window.Echo.leaveChannel(`chat.${chatRoomId}`);
};

// Disconnect Echo
export const disconnectEcho = () => {
  if (window.Echo) {
    window.Echo.disconnect();
  }
};