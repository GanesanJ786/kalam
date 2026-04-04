import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KalamService } from '../kalam.service';

@Component({
  selector: 'app-academy-approval',
  standalone: false,
  templateUrl: './academy-approval.component.html',
  styleUrls: ['./academy-approval.component.scss']
})
export class AcademyApprovalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  pendingAcademies: any[] = [];
  loading = true;
  adminEmail = 'adukalamapp@gmail.com';
  authenticated = false;
  adminPassword = '';

  constructor(
    private kalamService: KalamService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Check if already authenticated via sessionStorage
    if (sessionStorage.getItem('kalamAdminAuth') === 'true') {
      this.authenticated = true;
      this.loadPending();
    }
  }

  authenticate(): void {
    // Simple password gate — not a full auth system, just a basic guard
    if (this.adminPassword === 'kalam@2024admin') {
      this.authenticated = true;
      sessionStorage.setItem('kalamAdminAuth', 'true');
      this.loadPending();
    } else {
      this.snackBar.open('Invalid admin password', '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 4000,
        panelClass: ['red-snackbar']
      });
    }
  }

  loadPending(): void {
    this.loading = true;
    this.kalamService.getPendingAcademies()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.pendingAcademies = res.map((doc: any) => ({
          id: doc.payload.doc.id,
          ...doc.payload.doc.data() as {}
        }));
        this.loading = false;
      });
  }

  approve(academy: any): void {
    this.kalamService.approveAcademy(academy.id).then(() => {
      // Send approval email to academy owner
      const request = {
        to: academy.emailId,
        subject: 'Academy Approved - Kalam',
        ownerName: academy.name,
        coachName: `Your academy "${academy.academyName}" has been approved! You can now log in to Kalam and start managing your academy.`
      };
      this.kalamService.sendEmailer(request).subscribe();
      this.snackBar.open(`${academy.academyName} approved!`, '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 4000,
      });
    });
  }

  reject(academy: any): void {
    if (confirm(`Reject and remove "${academy.academyName}"? This cannot be undone.`)) {
      this.kalamService.rejectAcademy(academy.id).then(() => {
        const request = {
          to: academy.emailId,
          subject: 'Academy Registration - Kalam',
          ownerName: academy.name,
          coachName: `Your academy "${academy.academyName}" registration was not approved. Please contact support for more information.`
        };
        this.kalamService.sendEmailer(request).subscribe();
        this.snackBar.open(`${academy.academyName} rejected`, '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 4000,
        });
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
