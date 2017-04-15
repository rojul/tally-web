import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';

import { User } from './user.model';
import { ApiService } from '../api.service';
import { EuroComponent } from '../shared';
import { UserCreateDialogComponent } from './user-create-dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  searchActive: boolean = false;
  searchValue: string = '';
  searchFocusEventEmitter = new EventEmitter<boolean>();
  users: User[] = [];
  createUserDialogRef: MdDialogRef<UserCreateDialogComponent>;
  loading = true;
  
  constructor(
    private apiService: ApiService,
    public dialog: MdDialog,
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  openCreateUserDialog() {
    this.createUserDialogRef = this.dialog.open(UserCreateDialogComponent);

    this.createUserDialogRef.afterClosed().subscribe(result => {
      this.createUserDialogRef = undefined;
    })
  }

  toggleSearch() {
    this.searchActive = !this.searchActive;
    if (this.searchActive) {
      setTimeout(() => { // HACK
        this.searchFocusEventEmitter.emit(true);
      }, 0)
    } else
      this.searchValue = '';
  }

  private sortUsers(users: User[]): User[] {
    return users.sort((user1: User, user2: User) => {
      let name1 = user1.name.toLowerCase(), name2 = user2.name.toLowerCase()
      if (name1 < name2)
        return -1
      if (name1 > name2)
        return 1
      return 0
    })
  }

  private getUsers(): void {
    this.loading = true;
    this.apiService.getUsers().subscribe(
      users => {
        users = this.sortUsers(users)
        this.users = users
        this.loading = false;
      },
      err => {
        this.loading = false;
      });
  }

}
