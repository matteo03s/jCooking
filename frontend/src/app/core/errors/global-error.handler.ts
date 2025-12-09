import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ErrorService } from './error.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private errorService = inject(ErrorService);

  handleError(error: any): void {
    this.errorService.handle(error);
  }
}
