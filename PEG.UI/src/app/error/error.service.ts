import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService {

  errorMessage = '';

  constructor() {}

  getError(){
    return {message:''};
  }
}
