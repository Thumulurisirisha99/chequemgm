import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private service: ServiceService) { }
  logins: any[] = [];
  name: any;
  // page: number = 0;
  // size: number = 10;
  // sortField: string = 'id';
  // sortOrder: string = 'asc';
  page: number = 0;
  size: number = 1; // Default page size
  totalItems: number = 0;
  sortField: string = 'id';
  sortOrder: string = 'asc';
  result: any[] = [];
  totalPayPeriodAmount: any;
  issuedAmount: any;
  checkedAmount: any;
  pageSizes: number[] = [1, 25, 50, 100];
  startRow: number = 1;
  endRow: number = 10;
  totalPages: number = 0;
  months: any[] = [];
  year: number = 0;
  // result: any[] = [];
  searchQuery: any = '';
  selectedMonth: string = '';
  // totalItems: any;
  ngOnInit(): void {
    this.approvedList();
    this.recentLogin();
    this.name = sessionStorage.getItem("name");
    this.loadMonths();
  }

  recentLogin() {
    this.service.recentLogin().subscribe((res: any) => {
      console.log(res);
      this.logins = res;
    })
  }
  approvedList() {
    const formData = new FormData();
    formData.append('page', this.page.toString());
    formData.append('size', this.size.toString());
    formData.append('sortField', this.sortField);
    formData.append('sortOrder', this.sortOrder);
    if (this.searchQuery) {
      formData.append('searchQuery', this.searchQuery);
    }
    this.service.Approved(formData).subscribe((res: any) => {
      console.log("Approve", res);
      this.result = res.content;
      console.log("Approve", this.result);
      this.totalItems = res.totalElements;
      this.totalPages = Math.ceil(this.totalItems / this.size);
      this.updateRowRange();
    })
  }
  onSearchSubmit(): void {
    console.log('Search Query:', this.searchQuery);
    this.approvedList();
  }
  updateRowRange(): void {
    this.startRow = this.page * this.size + 1;
    this.endRow = Math.min((this.page + 1) * this.size, this.totalItems);
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.approvedList();
    }
  }

  nextPage(): void {
    if (this.page < this.lastPage()) {
      this.page++;
      this.approvedList();
    }
  }

  lastPage(): number {
    return Math.ceil(this.totalItems / this.size) - 1;
  }

  getPageNumbers(): number[] {
    const pageCount = this.lastPage() + 1;
    return Array.from(Array(pageCount).keys()).map(page => page + 1);
  }

  goToPage(pageNumber: number): void {
    this.page = pageNumber - 1;
    this.approvedList();
  }

  onPageSizeChange(event: any): void {
    this.size = +event.target.value;
    this.page = 0;
    this.approvedList();
  }
  // exist() {
  //   this.service.Exist().subscribe((res: any) => {
  //     console.log(res);
  //     this.months = res.months;
  //     this.year = res.year;

  //   })
  // }
  // onMonthChange(event: any) {
  //   this.selectedMonth = event.target.value;
  //   this.service.AmountCalculate(this.selectedMonth).subscribe(res => {
  //     console.log('Amount Data:', res);
  //   });
  // }
  loadMonths() {
    this.service.Exist().subscribe(res => {
      console.log('Months Loaded:', res);
      this.months = res.months;
      this.year = res.year;
      if (this.months.length > 0) {
        this.selectedMonth = this.months[0];
        this.onMonthChange({ target: { value: this.selectedMonth } } as unknown as Event);
      }
    });
  }

  onMonthChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedMonth = target.value;
    console.log("Selected Month:", this.selectedMonth);
    if (this.selectedMonth) {
      this.service.AmountCalculate(this.selectedMonth).subscribe(
        res => {
          console.log('Amount Data:', res);
          this.totalPayPeriodAmount = res.totalpayperiodamount;
          this.issuedAmount = res.IssuedAmount;
          this.checkedAmount = res.checkedAmount;

        },
        error => {
          console.error('Error fetching amount data:', error);
        }
      );
    }
  }


}
