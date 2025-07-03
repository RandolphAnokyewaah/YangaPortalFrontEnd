import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { UserRole } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
    error = '';
    roles: UserRole[] = [UserRole.Admin, UserRole.Marketing, UserRole.Support, UserRole.User];


  showUserModal = false;
  isEditMode = false;
modalUser: Partial<User> = { username: '', password: '', role: UserRole.User };
  editingId: number | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load users';
        this.loading = false;
      },
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.modalUser = {
  username: '',
  password: '',
  role: UserRole.User
};
    this.showUserModal = true;
    this.editingId = null;
  }

  openEditModal(user: User) {
    this.isEditMode = true;
this.modalUser = {
  ...user,
  role: user.role 
};
this.editingId = user.id ?? null;
    this.showUserModal = true;
  }

  closeUserModal() {
    this.showUserModal = false;
    this.modalUser = { username: '', password: '', role: UserRole.User };
    this.editingId = null;
  }

 saveUser() {
  const user: User = {
    id: this.editingId ?? 0,
    username: this.modalUser.username ?? '',
    password: this.modalUser.password ?? '',
    role: this.modalUser.role ?? UserRole.User
  };

  if (this.isEditMode && this.editingId !== null) {
    this.userService.updateUser(this.editingId, user).subscribe({
      next: () => {
        this.loadUsers();
        this.closeUserModal();
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.error = 'Failed to update user';
      }
    });
  } else {
    this.userService.createUser(user).subscribe({
      next: () => {
        this.loadUsers();
        this.closeUserModal();
      },
      error: (err) => {
        console.error('Create failed:', err);
        this.error = 'Failed to create user';
      }
    });
  }
}


  deleteUser(user: User) {
    if (confirm(`Delete user ${user.username}?`)) {
      this.userService.deleteUser(user.id ?? 0).subscribe({
        next: () => this.loadUsers(),
        error: () => (this.error = 'Failed to delete user'),
      });
    }
  }
}
