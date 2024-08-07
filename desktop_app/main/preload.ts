import { ipcRenderer, Notification, contextBridge } from 'electron';

// Sometimes these constants do not work properly. It's recommended to set the
// string directly in the ipcRenderer listener.
import {
  START_NOTIFICATION_SERVICE,
  NOTIFICATION_SERVICE_STARTED,
  NOTIFICATION_SERVICE_ERROR,
  NOTIFICATION_RECEIVED as ON_NOTIFICATION_RECEIVED,
  TOKEN_UPDATED,
} from 'electron-push-receiver/src/constants';

// Connects the renderer.js with main.js
contextBridge.exposeInMainWorld("electron", {
  // Gets called through the window object and returns the token stored locally
  getFCMToken: (channel: string, func: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.once(channel, func);
    ipcRenderer.send("getFCMToken");
  },
});

const senderId = 710166131124; // Replace 'yourSenderID' with your actual sender ID
ipcRenderer.send(START_NOTIFICATION_SERVICE, senderId);

// Listen for service successfully started
ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => {
  console.log('FCM service started');
  ipcRenderer.send('storeFCMToken', token);
});

// Handle notification errors
ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => {
  console.log(error);
});

// Handle notifications sent through Firebase
ipcRenderer.on(ON_NOTIFICATION_RECEIVED, (_, notification) => {
  const notif = new Notification({
    title: notification.title,
    body: notification.body,
  });

  notif.on('click', () => {
    ipcRenderer.send('notification-clicked', notification);
    
  });

  notif.show();
});

// Store the new token
ipcRenderer.on(TOKEN_UPDATED, (_, token) => {
  const event = new CustomEvent('fcmTokenUpdated', { detail: token });
  window.dispatchEvent(event);
});

window.addEventListener('DOMContentLoaded', () => {
  const minButton = document.getElementById('min-button');
  const maxButton = document.getElementById('max-button');
  const restoreButton = document.getElementById('restore-button');
  const closeButton = document.getElementById('close-button');

  minButton?.addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
  });

  maxButton?.addEventListener('click', () => {
    ipcRenderer.send('maximize-window');
  });

  restoreButton?.addEventListener('click', () => {
    ipcRenderer.send('restore-window');
  });

  closeButton?.addEventListener('click', () => {
    ipcRenderer.send('close-window');
  });

  ipcRenderer.on('window-maximized', () => {
    if (restoreButton && maxButton) {
      restoreButton.style.display = 'block';
      maxButton.style.display = 'none';
    }
  });

  ipcRenderer.on('window-unmaximized', () => {
    if (restoreButton && maxButton) {
      restoreButton.style.display = 'none';
      maxButton.style.display = 'block';
    }
  });
});

const handler = {
  send(channel: string, value: any) {
    ipcRenderer.send(channel, value);
  },
  
  on(channel: string, callback: (arg0: any) => any) {
    const subscription = (_event: any, ...args: any[]) => callback(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  storeFCMToken(token: any) {
    ipcRenderer.send('storeFCMToken', token);
  },
  getFCMToken() {
    return new Promise((resolve) => {
      ipcRenderer.send('getFCMToken');
      ipcRenderer.on('getFCMToken', (event, token) => {
        resolve(token);
      });
    });
  },
};

contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler;