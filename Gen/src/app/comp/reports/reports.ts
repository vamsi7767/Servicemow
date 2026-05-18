import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { IssueServiceTs } from '../../service/issue-service.ts';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';   // ✅ Needed for mat-table
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion'

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
   MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,        // ✅ include this
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatExpansionModule
  ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
})
export class Reports implements OnInit {
  openSections: { [key: string]: boolean } = {
    week: false,
    month: false,
    year: false,
    stale: false
  };

  report: any;
  chart: Chart | null = null;

  @ViewChild('weeklyChart') weeklyChart!: ElementRef<HTMLCanvasElement>;

  constructor(
    private issueService: IssueServiceTs,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.issueService.getReport().subscribe(data => {
      this.report = data;
      if (isPlatformBrowser(this.platformId)) {
        this.renderWeeklyChart();
      }
    });
  }

  toggleSection(section: string): void {
    this.openSections[section] = !this.openSections[section];
  }

  exportCSV(): void {
    if (!this.report) return;
    const rows: string[] = [];
    rows.push("ID,Title,Status,Created By,Created At,Updated At,Assigned To");

    const allIssues = [
      ...(this.report.weekClosedIssues || []),
      ...(this.report.monthClosedIssues || []),
      ...(this.report.yearClosedIssues || []),
      ...(this.report.olderThan30Days || [])
    ];

    allIssues.forEach((issue: any) => {
      rows.push([
        issue.id,
        `"${issue.title}"`,
        issue.status,
        issue.createdBy?.name || '',
        issue.createdAt || '',
        issue.updatedAt || '',
        issue.assignedTo?.name || ''
      ].join(","));
    });

    const blob = new Blob([rows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "issues-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  goBack(): void {
    window.history.back();
  }

  renderWeeklyChart() {
    if (!this.report?.weekClosedIssues || !this.weeklyChart) return;
    if (this.chart) this.chart.destroy();

    const labels = this.report.weekClosedIssues.map((issue: any) => issue.title);
    const data = this.report.weekClosedIssues.map(() => 1);

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels,
        datasets: [
          {
            label: 'Closed Issues (Weekly)',
            data,
            backgroundColor: '#42a5f5'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    };

    this.chart = new Chart(this.weeklyChart.nativeElement, config);
  }
}
