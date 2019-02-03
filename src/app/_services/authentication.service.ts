import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public baseUrl: string;
    public headers: any;
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.baseUrl = 'http://localhost:3000/';
        this.displayHeaders();
    }

    displayHeaders(){
       // const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
        let auth_token = JSON.parse(localStorage.getItem('auth_token'))
        let headers = new HttpHeaders()
        headers = headers.append('Authorization', auth_token); 
        this.headers = headers
    }
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(this.baseUrl+"authentication", { email, password })
            .pipe(map(user => {
                if (user && user.auth_token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('auth_token',JSON.stringify(user.auth_token))
                    this.currentUserSubject.next(user);
                }
                return user;
            }));
    }

    register(user: any){
         return this.http.post<any>(this.baseUrl+"create", {user: user})
            .pipe(map(user => {
                return user;
            }));   
    }
    getTodos(){
         let token = JSON.parse(localStorage.getItem('auth_token'))
         return this.http.get<any>(this.baseUrl+"todos",{headers: {"Authorization": token}})
            .pipe(map(todos => {
                return todos;
            }));   
    }

    logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('auth_token');
        this.currentUserSubject.next(null);
    }
}