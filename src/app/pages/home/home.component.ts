import { Component, AfterViewInit } from "@angular/core";
import { NgbAccordionModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { AuthService } from "../../services/auth.service";
import { MachineService } from "../../services/machine.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  standalone: true,
  imports: [NgbAccordionModule, FormsModule, CommonModule, TranslateModule],
})
export class HomeComponent implements AfterViewInit {
  isLoggedIn: boolean = false;

  stats = {
    machines: 0,
    members: 0,
    promotions: 0,
    users: 0,
  };

  rawStats = {
    machines: 0,
    members: 0,
    promotions: 0,
    users: 0,
  };

  constructor(
    public authService: AuthService,
    public machService: MachineService
  ) {}

  ngOnInit() {
    this.machService.getStats().subscribe({
      next: (data) => {
        this.rawStats = { ...data };
        this.animateStats();
      },
      error: (err) => {
        console.error("Failed to fetch machine stats:", err);
      }
    });
  }

  ngAfterViewInit() {}

  animateStats() {
  const duration = 1000;
  const frameRate = 60;
  const totalFrames = Math.round((duration / 1000) * frameRate);

  (Object.keys(this.rawStats) as Array<keyof typeof this.rawStats>).forEach(key => {
    let frame = 0;
    const increment = this.rawStats[key]! / totalFrames;

    const interval = setInterval(() => {
      frame++;
      this.stats[key] = Math.round(increment * frame);
      if (frame === totalFrames) {
        this.stats[key] = this.rawStats[key]!;
        clearInterval(interval);
      }
    }, 1000 / frameRate);
  });
}


  getStatClass(value: number): string {
    if (value > 100) return 'stat-green';
    if (value >= 50) return 'stat-yellow';
    return 'stat-red';
  }
}
