import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Member, MemberService } from '../../services/member.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  imports: [CommonModule, FormsModule]
})
export class MembersComponent implements OnInit {
  members: Member[] = [];
  loading = false;
  error = '';

  showModal = false;
  isEditMode = false;
  modalMember: Partial<Member> = { name: '', email: '' };
  editingId: number | null = null;

  constructor(private memberService: MemberService) { }

  ngOnInit() {
    this.fetchMembers();
  }

  fetchMembers() {
    this.loading = true;
    this.memberService.getMembers().subscribe({
      next: (data) => { this.members = data; this.loading = false; },
      error: (err) => { this.error = 'Failed to load members'; this.loading = false; }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.modalMember = { name: '', email: '' };
    this.showModal = true;
    this.editingId = null;
  }

  openEditModal(member: Member) {
    this.isEditMode = true;
    this.modalMember = { ...member };
    this.showModal = true;
    this.editingId = member.id;
  }

  closeModal() {
    this.showModal = false;
    this.modalMember = { name: '', email: '' };
    this.editingId = null;
  }

  saveMember() {
    if (this.isEditMode && this.editingId != null) {
      this.memberService.updateMember(this.editingId, this.modalMember).subscribe({
        next: () => { this.fetchMembers(); this.closeModal(); },
        error: () => { this.error = 'Failed to update member'; }
      });
    } else {
      this.memberService.createMember(this.modalMember).subscribe({
        next: () => { this.fetchMembers(); this.closeModal(); },
        error: () => { this.error = 'Failed to create member'; }
      });
    }
  }

  deleteMember(member: Member) {
    if (confirm('Are you sure you want to delete this member?')) {
      this.memberService.deleteMember(member.id).subscribe({
        next: () => this.fetchMembers(),
        error: (err) => {
          console.error('Delete failed:', err);
          this.error = 'Failed to delete member';

          // OPTIONAL: show toast or custom error
        }
      });
    }
  }
}
