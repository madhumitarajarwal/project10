import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class EndpointServiceService {

  constructor() { }

  public SERVER_URL = "http://localhost:8084";
  public MESSAGE = this.SERVER_URL + "/Message";
  public USER = this.SERVER_URL + "/User";
  public ROLE = this.SERVER_URL + "/Role";
  public COLLEGE = this.SERVER_URL + "/College";
  public MARKSHEET = this.SERVER_URL + "/Marksheet";
  public STUDENT = this.SERVER_URL + "/Student";
  public ASSETTRACKING = this.SERVER_URL + "/AssetTracking";
  public SUBJECT = this.SERVER_URL+ "/Subject";
  public FACULTY = this.SERVER_URL+ "/Faculty";
  public COURSE = this.SERVER_URL + "/Course";
  public TIMETABLE = this.SERVER_URL+ "/TimeTable";
  public JASPERREPORT = this.SERVER_URL+ "/Jasper";
  public CUSTOMER = this.SERVER_URL+ "/Customer";
  public SUPPLIER = this.SERVER_URL+ "/Supplier";
  public FOLLOWUP = this.SERVER_URL+ "/FollowUp";
  public PO = this.SERVER_URL+ "/Po";
  public TRADEHISTORY = this.SERVER_URL+ "/TradeHistory";
 
}
