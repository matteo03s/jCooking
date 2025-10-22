import {ToastTypeEnum} from './toast-type-enum';

export type Toast = {
  id: number,
  type: ToastTypeEnum;
  message: string;
}

