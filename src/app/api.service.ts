import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  GetAllChromebooks() {
    let headers = {
      //TODO: Needs to be given by server for release build
      'authorization': '123456'
    }

    return this.http.get<AllChromebooksQueryReturn>(`http://localhost:3000/chromebooks/`, {headers})
  }

  QueryChromebook(type: "VASD" | "SERIAL", code: string): Observable<QueryReturn> {
    let headers = {
      //TODO: Needs to be given by server for release build
      'authorization': '123456'
    }

    return this.http.get<QueryReturn>(`http://localhost:3000/chromebooks/${type}/${code}/info`, {headers})
  }

  QueryUser(key: string, type: string = "primaryEmail"): Observable<UserQueryReturn>{

    let headers = {
      //TODO: Needs to be given by server for release build
      'authorization': '123456'
    }

    return this.http.get<UserQueryReturn>(`http://localhost:3000/chromebooks/users/query?q=${type}&s=${key}`, {headers})
  }

  QueryStudent(key: string): Observable<StudentQueryReturn>{
    let headers = {
      //TODO: Needs to be given by server for release build
      'authorization': '123456'
    }

    return this.http.get<StudentQueryReturn>(`http://localhost:3000/chromebooks/students/${key}/info`, {headers})
  }

  LinkStudents() {
    let headers = {
      //TODO: Needs to be given by server for release build
      'authorization': '123456'
    }

    return this.http.get<any>('http://localhost:3000/chromebooks/students/link', {headers})
  }

  CreateStudent(student: ReturnStudent){
    let headers = {
      //TODO: Needs to be given by server for release build
      'authorization': '123456'
    }

    return this.http.post<any>('http://localhost:3000/chromebooks/students/create',student, {headers})
  }

  GetAllStudents(){
    let headers = {
      //TODO: Needs to be given by server for release build
      'authorization': '123456'
    }

    return this.http.get<StudentArrayQueryReturn>('http://localhost:3000/chromebooks/students/', {headers})
  }

  GetConfig(){
    let headers = {
      //TODO: Needs to be given by server for release build
      'authorization': '123456'
    }

    return this.http.get<any>('http://localhost:3000/server/config', {headers})
  }

  UpdateConfig(data: any) {
    let headers = {
      //TODO: Needs to be given by server for release build
      'authorization': '123456'
    }

    return this.http.post<any>('http://localhost:3000/server/dasdfadsfsa', {data}, {headers})
  }

  UpdateReturnParameters(student: Student, returnType:"ID" | "SERIAL" = "ID") {
    let sendData = this.ConvertFulltoReturnUser(student);
    let headers = {
      //TODO: Needs to be given by server for release build
      'authorization': '123456'
    }
    if(returnType == "ID")
      return this.http.patch(`http://localhost:3000/chromebooks/students/${student.GInfo.id}/update`,sendData, {headers: headers})
    else
      return this.http.patch(`http://localhost:3000/chromebooks/students/${student.Chromebook.serialNumber}/update`,sendData, {headers: headers})

  }

  UpdateBySheets(UpdateQuery: ReturnInfoQuery) {
    let headers = {
      //TODO: Needs to be given by server for release build
      'authorization': '123456'
    }
    return this.http.post(`http://localhost:3000/chromebooks/students/updateBySheets`,UpdateQuery, {headers: headers})

  }

  SetTicketToComplete(id: string) {
    let headers = {
      //TODO: Needs to be given by server for release build
      'authorization': '123456'
    }
    return this.http.get(`http://localhost:3000/tickets/${id}/setComplete`, {headers: headers})

  }
  CheckAdminPassword(password: string) {
    console.log(password)
    let headers = {
      'authorization': password
    }
    return this.http.get<boolean>(`http://localhost:3000/auth/checkAdmin`, {headers: headers})
  }
  LinkTicketsToStudents() {
    let headers = {
      //TODO: Needs to be given by server for release build
      'authorization': '123456'
    }
    return this.http.get(`http://localhost:3000/chromebooks/students/updateTicketParing`, {headers: headers})

  }

  ConvertFulltoReturnUser(student: Student): ReturnStudent {
    return {
      userID: student.GInfo.id,
      userAssignedChromebook: student.Chromebook.serialNumber,
      userName: student.Name,
      userEmail: student.GInfo.primaryEmail,
      //@ts-ignore
      userAssignedTickets: student.Tickets,
      returnedChromebook: student.ReturnData.collectedChromebook,
      returnedCharger: student.ReturnData.collectedCharger,
      returnedCase: student.ReturnData.collectedCase,
      //@ts-ignore
      returnNotes: student.ReturnData.notes,
    }
  }
}

export interface ReturnStudent{
  userID: string;
  userAssignedChromebook: string;
  userName: string;
  userEmail: string;
  userAssignedTickets: [string];
  returnedChromebook: boolean;
  returnedCharger: boolean;
  returnedCase: boolean;
  returnNotes: string;
}

export interface RecentUser {
  type: string;
  email: string;
}

export interface ActiveTimeRange {
  date: string;
  activeTime: number;
}

export interface TpmVersionInfo {
  family: string;
  specLevel: string;
  manufacturer: string;
  tpmModel: string;
  firmwareVersion: string;
  vendorSpecific: string;
}

export interface CpuTemperatureInfo {
  temperature: number;
  label: string;
}

export interface CpuStatusReport {
  reportTime: Date;
  cpuUtilizationPercentageInfo: number[];
  cpuTemperatureInfo: CpuTemperatureInfo[];
}

export interface SystemRamFreeReport {
  reportTime: Date;
  systemRamFreeInfo: string[];
}

export interface VolumeInfo {
  volumeId: string;
  storageTotal: string;
  storageFree: string;
}

export interface DiskVolumeReport {
  volumeInfo: VolumeInfo[];
}

export interface LastKnownNetwork {
  ipAddress: string;
  wanIpAddress: string;
}

export interface CState {
  displayName: string;
  sessionDuration: string;
}

export interface LogicalCpu {
  maxScalingFrequencyKhz: number;
  currentScalingFrequencyKhz: number;
  idleDuration: string;
  cStates: CState[];
}

export interface CpuInfo {
  model: string;
  architecture: string;
  maxClockSpeedKhz: number;
  logicalCpus: LogicalCpu[];
}

export interface Chromebook {
  kind: string;
  etag: string;
  deviceId: string;
  serialNumber: string;
  status: string;
  lastSync: Date;
  annotatedUser: string;
  annotatedLocation: string;
  annotatedAssetId: string;
  notes: string;
  model: string;
  osVersion: string;
  platformVersion: string;
  firmwareVersion: string;
  macAddress: string;
  bootMode: string;
  lastEnrollmentTime: Date;
  orgUnitPath: string;
  orgUnitId: string;
  recentUsers: RecentUser[];
  activeTimeRanges: ActiveTimeRange[];
  tpmVersionInfo: TpmVersionInfo;
  cpuStatusReports: CpuStatusReport[];
  systemRamTotal: string;
  systemRamFreeReports: SystemRamFreeReport[];
  diskVolumeReports: DiskVolumeReport[];
  lastKnownNetwork: LastKnownNetwork[];
  autoUpdateExpiration: string;
  cpuInfo: CpuInfo[];
}

export interface QueryReturn {
  time: Date;
  chromebook: Chromebook;
  tickets: any[];
}

export interface AllChromebooksQueryReturn {
  time: Date;
  chromebooks: Chromebook[];
}


//USERS


export interface Name {
  givenName: string;
  familyName: string;
  fullName: string;
}

export interface Email {
  address: string;
  primary: boolean;
}

export interface Language {
  languageCode: string;
  preference: string;
}

export interface User {
  kind: string;
  id: string;
  etag: string;
  primaryEmail: string;
  name: Name;
  isAdmin: boolean;
  isDelegatedAdmin: boolean;
  lastLoginTime: Date;
  creationTime: Date;
  agreedToTerms: boolean;
  suspended: boolean;
  archived: boolean;
  changePasswordAtNextLogin: boolean;
  ipWhitelisted: boolean;
  emails: Email[];
  languages: Language[];
  customerId: string;
  orgUnitPath: string;
  isMailboxSetup: boolean;
  isEnrolledIn2Sv: boolean;
  isEnforcedIn2Sv: boolean;
  includeInGlobalAddressList: boolean;
}

export interface UserQueryReturn {
  time: string,
  data: User
}



//STUDENTS


export interface Name {
  givenName: string;
  familyName: string;
  fullName: string;
}

export interface Email {
  address: string;
  primary: boolean;
}

export interface Language {
  languageCode: string;
  preference: string;
}

export interface Gender {
  type: string;
}

export interface GInfo {
  kind: string;
  id: string;
  etag: string;
  primaryEmail: string;
  name: Name;
  isAdmin: boolean;
  isDelegatedAdmin: boolean;
  lastLoginTime: Date;
  creationTime: Date;
  agreedToTerms: boolean;
  suspended: boolean;
  archived: boolean;
  changePasswordAtNextLogin: boolean;
  ipWhitelisted: boolean;
  emails: Email[];
  languages: Language[];
  aliases: string[];
  gender: Gender;
  customerId: string;
  orgUnitPath: string;
  isMailboxSetup: boolean;
  isEnrolledIn2Sv: boolean;
  isEnforcedIn2Sv: boolean;
  includeInGlobalAddressList: boolean;
  thumbnailPhotoUrl: string;
  thumbnailPhotoEtag: string;
  recoveryPhone: string;
}

export interface RecentUser {
  type: string;
  email: string;
}

export interface ActiveTimeRange {
  date: string;
  activeTime: number;
}

export interface TpmVersionInfo {
  family: string;
  specLevel: string;
  manufacturer: string;
  tpmModel: string;
  firmwareVersion: string;
  vendorSpecific: string;
}

export interface CpuTemperatureInfo {
  temperature: number;
  label: string;
}

export interface CpuStatusReport {
  reportTime: Date;
  cpuUtilizationPercentageInfo: number[];
  cpuTemperatureInfo: CpuTemperatureInfo[];
}

export interface SystemRamFreeReport {
  reportTime: Date;
  systemRamFreeInfo: string[];
}

export interface VolumeInfo {
  volumeId: string;
  storageTotal: string;
  storageFree: string;
}

export interface DiskVolumeReport {
  volumeInfo: VolumeInfo[];
}

export interface LastKnownNetwork {
  ipAddress: string;
  wanIpAddress: string;
}

export interface CState {
  displayName: string;
  sessionDuration: string;
}

export interface LogicalCpu {
  maxScalingFrequencyKhz: number;
  currentScalingFrequencyKhz: number;
  idleDuration: string;
  cStates: CState[];
}

export interface CpuInfo {
  model: string;
  architecture: string;
  maxClockSpeedKhz: number;
  logicalCpus: LogicalCpu[];
}

export interface Chromebook {
  kind: string;
  etag: string;
  deviceId: string;
  serialNumber: string;
  status: string;
  lastSync: Date;
  annotatedUser: string;
  annotatedLocation: string;
  annotatedAssetId: string;
  notes: string;
  model: string;
  osVersion: string;
  platformVersion: string;
  firmwareVersion: string;
  macAddress: string;
  bootMode: string;
  lastEnrollmentTime: Date;
  orgUnitPath: string;
  orgUnitId: string;
  recentUsers: RecentUser[];
  activeTimeRanges: ActiveTimeRange[];
  tpmVersionInfo: TpmVersionInfo;
  cpuStatusReports: CpuStatusReport[];
  systemRamTotal: string;
  systemRamFreeReports: SystemRamFreeReport[];
  diskVolumeReports: DiskVolumeReport[];
  lastKnownNetwork: LastKnownNetwork[];
  autoUpdateExpiration: string;
  cpuInfo: CpuInfo[];
}

export interface ReturnData {
  collectedChromebook: boolean,
  collectedCharger: boolean,
  collectedCase: boolean,
  notes?: string
}
export interface Student {
  GInfo: GInfo;
  Chromebook: Chromebook;
  Name: string;
  PrimaryEmail: string;
  ReturnData: ReturnData
  Tickets: any[];
}

export interface StudentQueryReturn {
  time: Date;
  student: Student;
}

export interface StudentArrayQueryReturn {
  time: Date;
  students: Student[];
}


export interface ReturnInfoQuery {
  sheetID: string,
  sheetPage: string,
  chromebookSerialIndex: string,
  chromebookReturnedIndex: string,
  caseReturnedIndex: string,
  chargerReturnedIndex: string,
  notesIndex: string
}
