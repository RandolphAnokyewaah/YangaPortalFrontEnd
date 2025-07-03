import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { MachineService, Machine } from '../../services/machine.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css'],
  imports: [CommonModule, FormsModule]
})
export class MachinesComponent implements OnInit {
  machines: Machine[] = [];
  loading = false;
  error = '';
  userRole: string = '';


  showModal = false;
  isEditMode = false;
  modalMachine: Partial<Machine> = { location: '', isActive: false };
  editingId: number | null = null;

  constructor(private machineService: MachineService,private authService: AuthService) {
        this.userRole = this.authService.getLocalStorageData('userrole', 'string') ?? '';

  }

  ngOnInit() {
    this.fetchMachines();
    this.userRole = this.authService.getLocalStorageData('userrole', 'string') ?? '';

  }

  fetchMachines() {
    this.loading = true;
    this.machineService.getMachines().subscribe({
      next: (data) => { this.machines = data; this.loading = false; },
      error: (err) => { this.error = 'Failed to load machines'; this.loading = false; }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.modalMachine = { location: '', isActive: false };
    this.showModal = true;
    this.editingId = null;
  }
isReadOnly(): boolean {
  return this.userRole === 'User';
}

  openEditModal(machine: Machine) {
    this.isEditMode = true;
    this.modalMachine = { ...machine };
    this.showModal = true;
    this.editingId = machine.id;
  }

  closeModal() {
    this.showModal = false;
    this.modalMachine = { location: '', isActive: false };
    this.editingId = null;
  }

  saveMachine() {
    if (this.isEditMode && this.editingId != null) {
      this.machineService.updateMachine(this.editingId, this.modalMachine).subscribe({
        next: () => { this.fetchMachines(); this.closeModal(); },
        error: () => { this.error = 'Failed to update machine'; }
      });
    } else {
      this.machineService.createMachine(this.modalMachine).subscribe({
        next: () => { this.fetchMachines(); this.closeModal(); },
        error: () => { this.error = 'Failed to create machine'; }
      });
    }
  }

  deleteMachine(machine: Machine) {
    if (confirm('Are you sure you want to delete this machine?')) {
      this.machineService.deleteMachine(machine.id).subscribe({
        next: () => this.fetchMachines(),
        error: () => { this.error = 'Failed to delete machine'; }
      });
    }
  }
}
