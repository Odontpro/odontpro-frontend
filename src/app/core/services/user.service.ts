import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';
import { User } from '../../shared/models/user.model';
import {catchError, map, switchMap} from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

}
