import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceService } from '../service/service.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  payPerioddates: string[] = ['202201', '202202', '202203', '202204', '202205'];
  businessUnits: any[] = ['HHC-GENX', 'KRIS'];
  selectedPayPeriod: string = '';
  payPeriodDateList: any = [202201, 202202, 202203];
  // businessUnits: any[] = ['HHC-GENX', 'KRIS'];
  // selectedPayPeriod: string = '';
  selectedBusinessUnit: string = '';
  page: number = 0;
  size: number = 10;
  modalTitle: any;
  totalPages: number = 0;
  sortField: string = 'id';
  sortOrder: string = 'asc';
  searchQuery: string = '';
  data: any[] = [];
  totalItems: number = 0;
  startRow: number = 1;
  endRow: number = 10;
  pageSizes: number[] = [10, 25, 50, 100]; // Available page sizes
  payPeriodDate: any;
  isLoading: boolean = false;
  upload!: FormGroup;
  selectedFile: File | null = null;
  selectedEmpCode: any;
  netSalary: any;
  empName: any;
  selectedPayPeriodDate: any;
  empCode: any;
  issuedAmount: any;
  chequeForm: FormGroup;
  constructor(private service: ServiceService, private formBuilder: FormBuilder) {
    this.chequeForm = this.formBuilder.group({
      businessUnit: [''],
      payPeriodDate: [''],
      file: [null]
    });
  }
  ngOnInit(): void {
    this.datafetch();
    this.upload = this.formBuilder.group({
      issueDate: ['', Validators.required],
      chequeSerialNumber: ['', [
        Validators.required,
        Validators.pattern(/^\d{12}$/)
      ]],
      //issuedAmount: ['', Validators.required],
      issuedAmount: [{ value: '', disabled: true }, Validators.required],
      image: [null]
    });
  }
  downloadEmployeeDetails() {
    this.selectedPayPeriod = this.chequeForm.get('payPeriodDate')?.value;
    this.selectedBusinessUnit = this.chequeForm.get('businessUnit')?.value;
    if (this.selectedPayPeriod) {
      const formData = new FormData();
      formData.append('BussinessUnit', this.selectedBusinessUnit || '');
      formData.append('payPeriodDate', this.selectedPayPeriod);

      this.service.downloadPayperiodexcel(formData).subscribe(response => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = `cheque_data_${this.selectedPayPeriod}${this.selectedBusinessUnit ? '_' + this.selectedBusinessUnit : ''}.xls`;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.error('No data found:', error.message);
          alert('No data found for the selected Pay Period and Business Unit.');
        } else {
          console.error('Error downloading file:', error.message);
          alert('An error occurred while downloading the file. Please try again later.');
        }
      });
    } else {
      console.error('Please select a Pay Period.');
      alert('Please select a Pay Period.');
    }
  }
  submitForm() {
    if (this.selectedPayPeriod) {
      this.isLoading = true;
      this.service.uploadPayPeriodData(this.selectedPayPeriod).subscribe({
        next: (response: any) => {
          console.log('Data uploaded successfully', this.selectedPayPeriod);
          Swal.fire({
            title: 'Success!',
            text: 'Uploaded successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error uploading data', error);
          if (error.status === 404) {
            Swal.fire('Payperiod already exists', 'Record with the same payPeriodDate and statusCode already exists', 'warning');
          } else {
            Swal.fire('Failed to upload', 'An unexpected error occurred. Please try again later.', 'error');
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      Swal.fire('Error', 'Please select a pay period and enter a comment', 'warning');
    }
  }


  datafetch() {
    const formData = new FormData();
    formData.append('page', this.page.toString());
    formData.append('size', this.size.toString());
    formData.append('sortField', this.sortField);
    formData.append('sortOrder', this.sortOrder);
    if (this.searchQuery) {
      formData.append('searchQuery', this.searchQuery);
    }
    this.service.dataFetch(formData).subscribe(
      (res: any) => {
        console.log("data fetch", res);
        this.data = res.content;
        console.log("data came", this.data);
        this.totalItems = res.totalElements;
        this.totalPages = Math.ceil(this.totalItems / this.size);
        this.updateRowRange();
        const firstItem = res.content[0];
        this.payPeriodDate = firstItem.fileMetadata.payPeriodDate;
        console.log(res);
      },
      (error: any) => {
        console.error('Error fetching data', error);
      }
    );
  }
  updateRowRange(): void {
    this.startRow = this.page * this.size + 1;
    this.endRow = Math.min((this.page + 1) * this.size, this.totalItems);
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.datafetch();
    }
  }

  nextPage(): void {
    if (this.page < this.lastPage()) {
      this.page++;
      this.datafetch();
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
    this.datafetch();
  }

  onPageSizeChange(event: any): void {
    this.size = +event.target.value;
    this.page = 0;
    this.datafetch();
  }
  onSearchSubmit(searchQuery: string): void {
    this.searchQuery = searchQuery;
    this.datafetch();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
    }
  }
  openUploadModal(payPeriodDate: string, empCode: string): void {
    console.log('Setting empCode:', empCode);
    console.log('Setting payPeriodDate:', payPeriodDate);
    this.selectedPayPeriodDate = payPeriodDate;
    this.selectedEmpCode = empCode;
    this.service.fetchchequeUploaddetails(this.selectedEmpCode, this.selectedPayPeriodDate).subscribe(
      response => {
        console.log('data fetched by empcode ', response);
        this.empCode = response.body.empCode;
        this.empName = response.body.empName;
        this.issuedAmount = response.body.bankCredit;
        this.payPeriodDate = response.body.fileMetadata.payPeriodDate;
        this.modalTitle = `Upload Cheque Details - ${this.empCode} - ${this.payPeriodDate}`;
        this.upload.patchValue({
          issuedAmount: this.issuedAmount
        });
        this.upload.get('issuedAmount')?.disable();
      }
      // error => {
      //   console.error('Upload failed', error);
      //   Swal.fire({
      //     title: 'Error!',
      //     text: 'Failed to upload data. Please try again.',
      //     icon: 'error',
      //     confirmButtonText: 'OK',
      //   });
      // }
    );
  }

  uploadCheque(): void {
    console.log('Uploading cheque for empCode:', this.selectedEmpCode);
    console.log('Uploading cheque for payPeriodDate:', this.selectedPayPeriodDate);
    const formData = new FormData();
    formData.append('issueDate', this.upload.get('issueDate')?.value);
    formData.append('chequeSerialNumber', this.upload.get('chequeSerialNumber')?.value);
    formData.append('issuedAmount', this.upload.get('issuedAmount')?.value);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.service.uploadChequeusingpayperiodandempcode(this.selectedEmpCode, this.selectedPayPeriodDate, formData).subscribe(
      response => {
        console.log('Upload successful', response);
        Swal.fire({
          title: 'Success!',
          text: 'Data uploaded!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.upload.reset();
      },
      error => {
        console.error('Upload failed', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to upload data. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
  uploadFile() {
    this.selectedPayPeriod = this.chequeForm.get('payPeriodDate')?.value;

    if (this.selectedFile && this.selectedPayPeriod) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('payPeriodDate', this.selectedPayPeriod);

      this.service.uploadDownloadExcel(formData).subscribe(
        (response: any) => {
          alert('File uploaded successfully!');
        },
        (error: HttpErrorResponse) => {
          console.error('Error uploading file:', error.message);
          alert('An error occurred while uploading the file. Please try again later.');
        }
      );
    } else {
      if (!this.selectedFile) {
        alert('Please select a file to upload.');
      } else {
        alert('Please select a Pay Period.');
      }
    }
  }
}
