import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'safeAvatar', standalone: true })
export class SafeAvatarPipe implements PipeTransform {
  transform(avatar?: string): string {
    return avatar ? `/assets/avatars/${avatar}` : '/assets/avatars/unknown.png';
  }
}
