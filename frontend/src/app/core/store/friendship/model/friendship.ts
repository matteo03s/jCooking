import {ActiveModel} from '../../../model/active-model';
import {Validator} from '../../../model/validator';
import {FriendshipStatus} from '../enum/FriendshipStatusEnum';

const validator = new Validator(
  'Friendship',
  [
    'id',
    'senderId',
    'receiverId',
    'senderName',
    'receiverName',
    'senderAvatar',
    'receiverAvatar',
    'status',
    'createdAt',
  ],
  [
  ]
);

export interface FriendshipJSON {
  id?: number;
  senderId: number;
  receiverId: number;
  senderName?: string;
  receiverName?: string;
  senderAvatar?: string;
  receiverAvatar?: string;
  status: FriendshipStatus;
  createdAt?: string;
}

export class Friendship extends ActiveModel {
  id?: number;
  senderId: number;
  receiverId: number;
  senderName?: string;
  receiverName?: string;
  senderAvatar?: string;
  receiverAvatar?: string;
  status: FriendshipStatus;
  createdAt?: Date;

  constructor(f: FriendshipJSON) {
    super (f, validator);
    this.id = f.id;
    this.senderId = f.senderId;
    this.receiverId = f.receiverId;
    this.senderName = f.senderName;
    this.receiverName = f.receiverName;
    this.senderAvatar = f.senderAvatar;
    this.receiverAvatar = f.receiverAvatar;
    this.status = f.status;
    this.createdAt = f.createdAt ? new Date(f.createdAt) : undefined;
  }

  public static fromJSON(json: FriendshipJSON): Friendship {
    return new Friendship(json);
  }

  static toJSON(f: Friendship): FriendshipJSON {
    return {
      id: f.id,
      senderId: f.senderId,
      receiverId: f.receiverId,
      senderName: f.senderName,
      receiverName: f.receiverName,
      senderAvatar: f.senderAvatar,
      receiverAvatar: f.receiverAvatar,
      status: f.status,
      createdAt: f.createdAt?.toISOString(),
    };
  }
}
