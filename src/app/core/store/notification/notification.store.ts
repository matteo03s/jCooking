import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Toast} from "./model/toast";
import {ToastTypeEnum} from './model/toast-type-enum';

interface NotificationState {
  toasts: Toast[];
}

export const initialState: NotificationState = {
  toasts: []
};

export const NotificationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store
    ) => ({
      removeToast: (id: number) => {
        patchState(store, {toasts: store.toasts().filter(toast => toast.id != id)});
      }
    })
  ),
  withMethods(
    (
      store
    ) => ({
      notifySuccess: (message: string) => {
        const newToast: Toast = {
          id: Date.now() + Math.random(),
          type: ToastTypeEnum.SUCCESS,
          message: message
        };
        const updatedToasts = [...store.toasts(), newToast];
        const limitedToasts = updatedToasts.slice(-3);
        patchState(store, {toasts: limitedToasts});
        setTimeout(() => store.removeToast(newToast.id), 10000)
      },
      notifyError: (message: string) => {
        const newToast: Toast = {
          id: Date.now() + Math.random(),
          type: ToastTypeEnum.DANGER,
          message: message
        };
        patchState(store, {toasts: [...store.toasts(), newToast]});
        setTimeout(() => store.removeToast(newToast.id), 10000)
      }
    })
  )
);
