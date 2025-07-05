import { CommonModule } from "@angular/common";
import { Component, NgModule, OnInit } from "@angular/core";
import { MachineService, Machine } from "../../services/machine.service";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { PromotionService } from "../../services/promotion.service";

@Component({
  selector: "app-machines",
  templateUrl: "./machines.component.html",
  styleUrls: ["./machines.component.css"],
  imports: [CommonModule, FormsModule],
})
export class MachinesComponent implements OnInit {
  machines: Machine[] = [];
  loading = false;
  error = "";
  userRole: string = "";
  assignedPromotions: any[] = [];
  promotions: any[] = [];
  toastMessage: string = '';
showToast: boolean = false;

showSuccessToast(message: string) {
  this.toastMessage = message;
  this.showToast = true;
  setTimeout(() => this.showToast = false, 3000);
}

closeToast() {
  this.showToast = false;
}

selectedPromotions: { [machineId: number]: number | null } = {};

  showModal = false;
  isEditMode = false;
  modalMachine: Partial<Machine> = { location: "", isActive: false };
  editingId: number | null = null;

  constructor(
    private machineService: MachineService,
    private authService: AuthService,
    private promotionService: PromotionService
  ) {
    this.userRole =
      this.authService.getLocalStorageData("userrole", "string") ?? "";
  }

  ngOnInit() {
    this.fetchMachines();
    this.userRole =
      this.authService.getLocalStorageData("userrole", "string") ?? "";
      this.promotionService.getAll().subscribe((data) => this.promotions = data);

  }

assignPromotion(machineId: number) {
  const promotionId = this.selectedPromotions[machineId];
  if (!promotionId) return;

  this.machineService.assignPromotion(machineId, promotionId).subscribe({
    next: () => {
      this.machineService.getAssignedPromotions(machineId).subscribe({
        next: (promos) => {
          const machineIndex = this.machines.findIndex(m => m.id === machineId);
          if (machineIndex > -1) {
            this.machines[machineIndex] = {
              ...this.machines[machineIndex],
              promotions: promos
            };
          }

          this.selectedPromotions[machineId] = null;
          this.showSuccessToast(` Promotion assigned to Machine #${machineId}`);
        },
        error: () => {
          this.showErrorToast(' Failed to reload promotions');
        }
      });
    },
    error: (err) => {
      const errMsg = err?.error?.message || err?.message || '';

      if (errMsg.includes('already assigned')) {
        this.showErrorToast(` Promotion is already assigned to Machine #${machineId}`);
      } else {
        this.showErrorToast(` Failed to assign promotion`);
        console.error(err);
      }
    }
  });
}


showErrorToast(message: string) {
  this.toastMessage = message;
  this.showToast = true;
  setTimeout(() => this.showToast = false, 3000);
}

unassignPromotion(machineId: number, promotionId: number) {
  this.machineService.unassignPromotion(machineId, promotionId).subscribe({
    next: () => {
      const machine = this.machines.find(m => m.id === machineId);
      if (machine) {
        // Refresh promotions
        this.machineService.getAssignedPromotions(machineId).subscribe({
          next: promos => {
            machine.promotions = promos;
            this.showSuccessToast(` Promotion unassigned from Machine #${machineId}`);
          }
        });
      }
    },
    error: () => this.showSuccessToast('Failed to unassign promotion')
  });
}

  fetchMachines() {
    this.loading = true;
    this.machineService.getMachines().subscribe({
      next: (machines) => {
        this.machines = machines;
        this.loading = false;

        // 💡 For each machine, load its assigned promotions
        this.machines.forEach((machine) => {
          this.machineService.getAssignedPromotions(machine.id).subscribe({
            next: (promos) => (machine["promotions"] = promos),
            error: () =>
              console.error(
                `Failed to load promotions for machine ${machine.id}`
              ),
          });
        });
      },
      error: (err) => {
        this.error = "Failed to load machines";
        this.loading = false;
      },
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.modalMachine = { location: "", isActive: false };
    this.showModal = true;
    this.editingId = null;
  }
  isReadOnly(): boolean {
    return this.userRole === "User";
  }

  openEditModal(machine: Machine) {
    this.isEditMode = true;
    this.modalMachine = { ...machine };
    this.showModal = true;
    this.editingId = machine.id;
  }

  closeModal() {
    this.showModal = false;
    this.modalMachine = { location: "", isActive: false };
    this.editingId = null;
  }

  saveMachine() {
    if (this.isEditMode && this.editingId != null) {
      this.machineService
        .updateMachine(this.editingId, this.modalMachine)
        .subscribe({
          next: () => {
            this.fetchMachines();
            this.closeModal();
          },
          error: () => {
            this.error = "Failed to update machine";
          },
        });
    } else {
      this.machineService.createMachine(this.modalMachine).subscribe({
        next: () => {
          this.fetchMachines();
          this.closeModal();
        },
        error: () => {
          this.error = "Failed to create machine";
        },
      });
    }
  }

  deleteMachine(machine: Machine) {
    if (confirm("Are you sure you want to delete this machine?")) {
      this.machineService.deleteMachine(machine.id).subscribe({
        next: () => this.fetchMachines(),
        error: () => {
          this.error = "Failed to delete machine";
        },
      });
    }
  }
}
