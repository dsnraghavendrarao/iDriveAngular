import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { AuthenticationService } from '@/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    todos: [];

    constructor(
        private authenticationService: AuthenticationService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
            this.todos = [];
        });
    }

    ngOnInit() {
        
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    loadAllUsers() {
        this.authenticationService.getTodos().pipe(first()).subscribe(todos => {
            if(todos["success"]){
                this.todos = todos.todos;
            }
        });
    }
}