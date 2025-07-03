import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    imports: [RouterModule, CommonModule],
})
export class SidebarComponent {
    userRole: string | null = '-1';
    constructor(public authService: AuthService) {
        this.userRole = this.authService.getLocalStorageData('userrole', 'number');
    }
}
