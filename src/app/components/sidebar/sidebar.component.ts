import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    imports: [RouterModule, CommonModule],
})
export class SidebarComponent implements OnInit {
    userRole: string | null = '-1';
    username: string | null = null;

    constructor(public authService: AuthService) {}

    ngOnInit(): void {
        this.userRole = this.authService.getLocalStorageData('userrole', 'string');
        this.username = this.authService.getUsernameFromToken();
    }
}
