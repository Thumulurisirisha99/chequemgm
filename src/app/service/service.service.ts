import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  // ngZone: any;
  constructor(private http: HttpClient, private storageService: StorageService, private route: Router) { }
  private employeeurl = "http://localhost:8099/employee"
  //login 
  login(formData: FormData): Observable<any> {
    return this.http.post<any>(this.employeeurl + "/login", formData);
  }
  //reset password
  resetpassword(formData: FormData): Observable<any> {
    return this.http.post<any>(this.employeeurl + "/sendOtp", formData);
  }
  //verify otp
  verifyOtp(formData: FormData): Observable<any> {
    return this.http.post<any>(this.employeeurl + "/verifyOtp", formData);
  }
  //create password
  createPassword(formData: FormData): Observable<any> {
    return this.http.post<any>(this.employeeurl + "/resetPassword", formData);
  }
  //Registaion authentication
  registration(employee: any, image: File | null, defaultImage: string | null = null): Observable<any> {
    const formData = new FormData();
    if (employee) {
      formData.append('employee', JSON.stringify(employee));
    }
    if (image) {
      formData.append('image', image, image.name);
    } else if (defaultImage) {
      const emptyBlob = new Blob([''], { type: 'application/octet-stream' });
      const emptyFile = new File([emptyBlob], 'empty.txt');
      formData.append('image', emptyFile);
    }
    return this.http.post<any>(this.employeeurl + "/registration", formData);
  }
  private masterurl = "http://localhost:8099/master"
  //roles
  roles(data: any): Observable<any> {
    return this.http.post<any>(this.masterurl + "/role", data);
  }
  //department
  department(data: any): Observable<any> {
    return this.http.post<any>(this.masterurl + "/department", data);
  }
  //userExpiry
  userExpiry(data: any): Observable<any> {
    return this.http.post<any>(this.masterurl + "/userExpiry", data);
  }
  private chequeUrl = "http://localhost:8099/cheque"
  //fileStatus
  filestatus(formData: FormData): Observable<any> {
    return this.http.post<any>(this.chequeUrl + "/filedata", formData);
  }
  //remove
  removeStatus(payPeriodDate: string, status: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.chequeUrl}/removeData/${payPeriodDate}/${status}`;
    return this.http.post<any>(url, null, { headers: headers });
  }
  //checked data fetch 
  checkedData(formData: FormData): Observable<any> {
    const url = `${this.chequeUrl}/chequeInfo/checked`;
    return this.http.post<any>(url, formData);
  }
  // Upload Cheque Data
  uploadCheque(empCode: string, payPeriodDate: string, formData: FormData): Observable<any> {
    const url = `${this.chequeUrl}/uploadCheques/${empCode}/${payPeriodDate}`;
    return this.http.post<any>(url, formData);
  }
  //Fetch Cheque Data
  fetchChequeBy(empCode: string, payPeriodDate: string): Observable<any> {
    const url = `${this.chequeUrl}/fetchCheque/${empCode}/${payPeriodDate}`;
    return this.http.post<any>(url, null);
  }
  //recentLogin
  recentLogin() {
    return this.http.get<any>(this.employeeurl + "/loginHistory");
  }
  //PayPeriod dates
  payPeriodDate() {
    const url = `${this.chequeUrl}/currentDates`;
    return this.http.post<any>(url, null)
  }
  //updatechequeDetails
  UpdateChequeDetails(empCode: string, formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    const url = `http://localhost:8099/cheque/updateCheques/${empCode}`;
    // Do not set Content-Type header when using FormData
    return this.http.post<any>(url, formData, { headers: headers });
  }

  //checkApproved
  Approved(formData: FormData): Observable<any> {
    const url = `${this.chequeUrl}/chequeApproved`;
    return this.http.post<any>(url, formData);
  }
  //existPayPeriodDates
  Exist() {
    const url = `${this.chequeUrl}/existDates`;
    return this.http.post<any>(url, null);
  }
  //amountCalculate
  AmountCalculate(payPeriodDate: any) {
    const headers = new HttpHeaders();
    const url = `http://localhost:8099/cheque/amountCalculate/${payPeriodDate}`;
    return this.http.post<any>(url, { headers: headers });
  }


  //uploadpayperodwisedata
  uploadPayPeriodData(payPeriodDate: string) {
    const headers = new HttpHeaders();
    const url = `http://localhost:8099/cheque/data/${payPeriodDate}`;
    return this.http.post<any>(url, { headers: headers });
  }
  // user profile
  profile(username: string) {
    return this.http.post<any>(`${this.employeeurl}/fetchBy/${username}`, {});
  }
  //image fetch for profile
  image(username: any) {
    return this.http.post<any>(`${this.employeeurl}/fetchImage/${username}`, {});
  }
  //uploadimage
  uploadImage(formData: FormData, username: any) {
    return this.http.post<any>(`${this.employeeurl}/uploadImage/${username}`, formData);
  }

  //deleteImage
  deleteImage(username: any) {
    return this.http.post<any>(`${this.employeeurl}/deleteImage/${username}`, {});
  }

  //All data fetch
  dataFetch(formData: FormData) {
    const url = `${this.chequeUrl}/cheque`;
    return this.http.post<any>(url, formData);
  }

  //uploadCheque using payperiod
  uploadChequeusingpayperiodandempcode(empCode: string, payPeriodDate: string, formData: FormData) {
    const url = `${this.chequeUrl}/chequeUpload/${empCode}/${payPeriodDate}`;
    return this.http.post<any>(url, formData);
  }
  //chequeData fetching for uploadcheque 
  fetchchequeUploaddetails(empCode: string, payPeriodDate: string) {
    const url = `${this.chequeUrl}/fetchchequeUploaddetails/${empCode}/${payPeriodDate}`;
    return this.http.post<any>(url, null);
  }
  //downloadpayperiodexcel
  // downloadPayperiodexcel(formData: FormData) {
  //   return this.http.post<any>(`${this.chequeUrl}/downloadChequeData`, formData);
  // }
  downloadPayperiodexcel(formData: FormData) {
    return this.http.post(`${this.chequeUrl}/downloadChequeData`, formData, {
      responseType: 'blob', // Set the response type to blob
    })
  }
  uploadDownloadExcel(formData: FormData) {
    return this.http.post(`${this.chequeUrl}/fileUpload`, formData)
  }






















  // setToken(token: string) {
  //   console.log('Setting token:', token);
  //   this.storageService.setItem('token', token);
  // }

  // getToken() {
  //   const token = this.storageService.getItem('token');
  //   console.log('Retrieved token:', token);
  //   return token;
  // }


  // setUserName(username: string) {
  //   this.storageService.setItem('username', username);
  // }

  // getUserName() {
  //   return this.storageService.getItem('username');
  // }

  // setName(name: string) {
  //   this.storageService.setItem('name', name);
  // }

  // getName() {
  //   return this.storageService.getItem('name');
  // }

  // setRole(role: string) {
  //   this.storageService.setItem('role', role);
  // }

  // getRole() {
  //   return this.storageService.getItem('role');
  // }
  // isAdmins() {
  //   return this.getRole() === 'ADMIN';
  // }
  // isLoggedIn(): boolean {
  //   const token = this.getToken();
  //   console.log('Is Logged In:', !!token);
  //   return token !== null && !this.isTokenExpired(token);
  // }

  // isTokenExpired(token: string): boolean {
  //   const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
  //   return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  // }

  // getToken() {
  //   const token = this.storageService.getItem('token');
  //   console.log('Retrieved token:', token);
  //   return token;
  // }

  // private sessionTimeout: any;
  // private readonly SESSION_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  // startSession(): void {
  //   this.resetSessionTimeout();
  // }

  // resetSessionTimeout(): void {
  //   console.log('Resetting session timeout');
  //   if (this.sessionTimeout) {
  //     clearTimeout(this.sessionTimeout);
  //   }
  //   this.sessionTimeout = setTimeout(() => {
  //     this.ngZone.run(() => this.endSession());
  //   }, this.SESSION_DURATION);
  // }

  // endSession(): void {
  //   console.log('Session ended');
  //   this.storageService.clear();
  //   this.route.navigate(['/login']);
  // }
  setToken(token: string): void {
    console.log('Setting token:', token);
    this.storageService.setItem('token', token);
  }

  getToken(): string | null {
    const token = this.storageService.getItem('token');
    console.log('Retrieved token:', token);
    return token;
  }

  setUserName(username: string): void {
    this.storageService.setItem('username', username);
  }

  getUserName(): string | null {
    return this.storageService.getItem('username');
  }

  setName(name: string): void {
    this.storageService.setItem('name', name);
  }

  getName(): string | null {
    return this.storageService.getItem('name');
  }

  setRole(role: string): void {
    this.storageService.setItem('role', role);
  }

  getRole(): string | null {
    return this.storageService.getItem('role');
  }

  isAdmins(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isTokenExpired(token: string): boolean {
    try {
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      return (Math.floor((new Date()).getTime() / 1000)) >= expiry;
    } catch (e) {
      console.error('Error checking token expiry:', e);
      return true;
    }
  }
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token === null) {
      console.log('Is Logged In: false');
      return false;
    }

    const tokenExpired = this.isTokenExpired(token);
    if (tokenExpired) {
      this.storageService.clear();
      console.log('Token expired, clearing storage.');
    }

    console.log('Is Logged In:', !tokenExpired);
    return !tokenExpired;
  }
  logout(): void {
    this.storageService.clear();
    this.route.navigate(['/login']);
  }
}
