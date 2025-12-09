import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: number;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: []
};

export const NotificationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {

    const addNotification = (message: string, type: NotificationType) => {
      const notification: Notification = {
        id: crypto.randomUUID(),
        message,
        type,
        timestamp: Date.now()
      };
      patchState(store, { notifications: [...store.notifications(), notification] });

      setTimeout(() => {
        patchState(store, {
          notifications: store.notifications().filter((n) => n.id !== notification.id)
        });
      }, 3000);
    };

    return {
      notifySuccess(message: string) {
        addNotification(message, 'success');
      },
      notifyError(message: string) {
        addNotification(message, 'error');
      },
      notifyInfo(message: string) {
        addNotification(message, 'info');
      },
      notifyWarning(message: string) {
        addNotification(message, 'warning');
      },
      /** ✅ nuovo metodo */
      removeNotification(id: string) {
        patchState(store, {
          notifications: store.notifications().filter((n) => n.id !== id)
        });
      },
      clearAll() {
        patchState(store, { notifications: [] });
      }
    };
  })
);
