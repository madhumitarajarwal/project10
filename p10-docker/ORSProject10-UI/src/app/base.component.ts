import { OnInit } from '@angular/core';
import { ServiceLocatorService } from './service-locator.service';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from './http-service.service';
import { formatNumber } from '@angular/common';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';


export class BaseCtl implements OnInit {

  public api = {
    endpoint: null,
    get: null,
    save: null,
    search: null,
    delete: null,
    deleteMany: null,
    preload: null,
    report: null,
    address: null
  }

  initApi(ep) {
    this.api.endpoint = ep;
    this.api.get = ep + "/get";
    this.api.save = ep + "/save";
    this.api.search = ep + "/search";
    this.api.delete = ep + "/delete";
    this.api.deleteMany = ep + "/deleteMany";
    this.api.preload = ep + "/preload";
    this.api.report = ep + "/report";
    this.api.address = ep + "/address";

    console.log("API", this.api);
  }

  /**
   * Form contains preload data, error/sucess message 
   */
  public form: any = {

    error: false, //error 
    message: null, //error or success message
    preload: [], // preload data
    data: { id: null }, //form data
    inputerror: {}, // form input error messages
    searchParams: {}, //search form
    searchMessage: null, //search result message
    list: [], // search list 
    pageNo: 0

  };
  nextList = 0;
  /**
   * Initialize services 
   * 
   * @param serviceLocator 
   * @param route 
   */
  constructor(public endpoint, public serviceLocator: ServiceLocatorService, public route: ActivatedRoute) {

    var _self = this;

    _self.initApi(endpoint);

    /**
     * Get primary key from path variale
     */
    serviceLocator.getPathVariable(route, function (params) {
      _self.form.data.id = params["id"];
      console.log('I GOT ID', _self.form.data.id);
    })
  }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.preload();
    if (this.form.data.id && this.form.data.id > 0) {
      this.display();
    }
  }

  /**
   * Loded preload data
   */
  preload() {
    console.log("preload start")
    var _self = this;
    this.serviceLocator.httpService.get(_self.api.preload, function (res) {
      console.log("base list preload", _self.api.preload)
      if (res.success) {
        _self.form.preload = res.result;
        console.log(res.result);
      } else {
        _self.form.error = true
        _self.form.message = res.result.message;
      }
      console.log('FORM', _self.form);
    });
  }

  validate() {
    return this.validateForm(this.form.data);
  }

  /**
   * Override by childs 
   * 
   * @param form 
   */
  validateForm(form) {
  }


  /**
   * Searhs records 
   */
  search() {
    console.log("search start")
    var _self = this;
    console.log("Search Form", _self.form.searchParams);
    this.serviceLocator.httpService.post(_self.api.search + "/" + _self.form.pageNo, _self.form.searchParams, function (res) {


      if (res.success) {
        _self.form.list = res.result.data;
        _self.nextList = res.result.nextList;


        if (_self.form.list.length == 0) {

          _self.form.message = "No record found";
          _self.form.error = true;
        }
        console.log("List Size", _self.form.list.length);
      } else {
        _self.form.error = false;
        _self.form.message = res.result.message;
      }
      console.log('FORM', _self.form);
    });
  }

  searchOperation(operation: String) {
    console.log("previous/next search start")
    var _self = this;
    console.log("Search Form", _self.form.searchParams);
    this.serviceLocator.httpService.post(_self.api.search + "/" + _self.form.pageNo, _self.form.searchParams, function (res) {

      if (operation == 'next' || operation == 'previous') {
        _self.nextList = res.result.nextList;
        _self.form.message = null;
        _self.form.error = false;
      }

      if (res.success) {
        _self.form.list = res.result.data;
        if (_self.form.list.length == 0) {
          _self.form.message = "No record found";
          _self.form.error = true;
        }
        console.log("List Size", _self.form.list.length);
      } else {
        _self.form.error = false;
        _self.form.message = res.result.message;
      }
      console.log('FORM', _self.form);
    });
  }

  /**
   * Contains display logic. It fetches data from database for the primary key 
   */
  display() {

    var _self = this;
    console.log('Inside display method');
    this.serviceLocator.httpService.get(_self.api.get + "/" + _self.form.data.id, function (res) {
      _self.form.data.id = 0;
      if (res.success) {
        _self.populateForm(_self.form.data, res.result.data);
      }
      else {
        _self.form.error = true;
        _self.form.message = res.result.message;
      }
      console.log('FORM', _self.form);
    });
  }

  /**
   * Populate HTML form data
   * Overridden by child classes.
   * 
   * @param form 
   * @param data 
   */
  populateForm(form, data) {
    form.id = data.id;
    console.log(form.iduser + 'formid in base ctl populate form');
  }

  /**
   * Contains submit logic. It saves data
   */


  submit() {
    var _self = this;

    console.log(this.form + "submit running start");
    console.log("form data going to be submit" + this.form.data);
    //  console.log("form data going to be submit" + this.studentId);
    this.serviceLocator.httpService.post(this.api.save, this.form.data, function (res) {
      _self.form.message = '';
      _self.form.inputerror = {};

      console.log('dataa ===== > ', res.result.data);

      if (res.success) {
        _self.form.message = "Data is saved";
        _self.form.data.id = res.result.data;

        console.log(_self.form.data.id);
        //  console.log("--------------------.");
        //return _self.form.data.id ;
      } else {
        _self.form.error = true;
        if (res.result.inputerror) {
          _self.form.inputerror = res.result.inputerror;
        }
        _self.form.message = res.result.message;
      }
      _self.form.data.id = res.result.data.id;
      console.log('FORM', _self.form);
    });
  }

  delete(id, callback?) {
    var _self = this;
    this.serviceLocator.httpService.get(_self.api.delete + "/" + id, function (res) {
      if (res.success) {
        _self.form.message = "Data is deleted";
        if (callback) {
          console.log('Response Success and now Calling Callback');
          //  callback();  
          this.search();
        }
      } else {
        _self.form.error = true;
        _self.form.message = res.result.message;
      }
    });
  }

  deleteMany(id, callback?) {
    var _self = this;
    this.serviceLocator.httpService.post(_self.api.deleteMany + "/" + id, this.form.searchParams, function (res) {
      if (res.success) {
        _self.form.message = "Data is deleted";

        if (callback) {
          console.log('Response Success and now Calling Callback');
          _self.form.list = res.result.data;
          console.log("List ::  ", + res.data);
          console.log("List Size", _self.form.list.length);
          //  callback();       

        }
      } else {
        _self.form.error = true;
        _self.form.message = res.result.message;
      }
    });
  }


  generateReport() {
    var _self = this;
    console.log('********* Generating Report ********************');
    this.serviceLocator.httpService.get(_self.api.report, function (res) {

      if (res.success) {
        console.log('*********  Report Generated ********************');
        alert('pass');

      } else {
        console.log('********* Error in Generating Report  ********************');
        alert('fail');
      }
    });

  }
  /**
   * Forward to page
   * @param page 
   */

  forward(page) {
    console.log(page + '--->>page value');
    this.serviceLocator.forward(page);
  }

  validateMobileInput(event: KeyboardEvent) {
    const values = (event.target as HTMLInputElement).value + event.key;
    if (!/^[6-9][0-9]{0,9}$/.test(values)) {
      event.preventDefault();
    }

  }

  validateAlphabetInput(event: KeyboardEvent) {

    const str = event.key;
    console.log(str);
    if (!/^[a-zA-Z\s]*$/.test(str)) {
      event.preventDefault();
    }
  }


  validateAlphanumericInput(event: KeyboardEvent) {

    const str = event.key;
    console.log(event);
    console.log(str);
    if (!/^[a-zA-Z0-9\s]$/.test(str)) {
      event.preventDefault();
    }
  }
  validateAlphanumericInput1(event: KeyboardEvent) {
    console.log(event);
    const str = event.key;
    console.log(str);
    if (!/^[a-zA-Z0-9\s.,-]$/.test(str)) {
      event.preventDefault();
    }
  }


  validateNumericInput(event: KeyboardEvent) {

    const str = event.key;
    console.log(str);
    if (!/^\d$/.test(str)) {
      event.preventDefault();
    }
  }

  validateDecimalInput(event: KeyboardEvent) {

    const str = event.key;
    console.log(event);
    if (!/^\d$|^\.$/.test(str)) {
      event.preventDefault();
    }


    //validation khatam


    //date format krme ke lie


  }

  formatDate(event: any) {
    const selectedDate = new Date(event);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    this.form.searchParams.appliedDate = formattedDate;
  }
  convertToLocalDate(dateString: string): string {
    const date = new Date(dateString);
    // Format date to 'MM/DD/YYYY'
    const options: any = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  }

  // Validation function

  filterInput(event: KeyboardEvent, errorField: string, maxLength: number, type: string): void {
    const charCode = event.which ? event.which : event.keyCode;
    console.log('charCode=', charCode);
    const charStr = String.fromCharCode(charCode);
    let allowedChars: RegExp;
    let errorMsg: string, lerrorMsg: string;

    switch (type) {
      case 'int':
        allowedChars = /^[0-9]$/;  // Allows numbers and numpad keys
        errorMsg = 'Only integers are allowed.';
        lerrorMsg = 'digits';
        break;


      case 'double':
        // Allow digits and a single decimal point
        allowedChars = /^[0-9]*\.?[0-9]*$/; // We will handle the decimal point separately
        errorMsg = 'Only numbers and one decimal point are allowed.';
        lerrorMsg = 'digits and one decimal point';
        break;

      case 'char':
        allowedChars = /^[a-zA-Z\s.]+$/; // Accepts only alphabetic characters, spaces, and periods
        errorMsg = 'Only alphabetic characters allowed.';
        lerrorMsg = 'alphabetic characters';
        break;


      default:
        allowedChars = /^[a-zA-Z0-9\s.-]+$/;
        errorMsg = 'Only alphanumeric chars are allowed.';
        lerrorMsg = 'characters';
        break;
    }

    const inputElement = event.target as HTMLInputElement;
    let input: string = inputElement.value;
    // Numpad key codes range from 96 (Numpad 0) to 105 (Numpad 9)
    const isNumpadKey = charCode >= 96 && charCode <= 105;

    // Check if the typed character matches the allowed characters
    if ((!allowedChars.test(charStr) && charCode !== 8 && charCode !== 32 && charCode !== 16 && charCode !== 46)
      || (type === 'char' && isNumpadKey)) {
      event.preventDefault();
      this[errorField] = errorMsg;
    }

    else if (charCode !== 8 && input.length >= maxLength) {
      event.preventDefault();
      this[errorField] = `Only ${maxLength} ${lerrorMsg} are allowed.`;
    } else {
      this[errorField] = '';
    }

    inputElement.addEventListener('blur', () => {
      this[errorField] = '';
    });


    console.log('Input:', input);
  }

  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }
  validateDecimal(event: KeyboardEvent): boolean {
    const inputChar = String.fromCharCode(event.keyCode);
    const pattern = /^[0-9]*\.?[0-9]*$/;

    // Allow backspace, tab, escape, enter, and arrow keys
    if (event.key === 'Backspace' || event.key === 'Tab' || event.key === 'Enter' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      return true;
    }

    // Get the current value and add the input character to it
    const currentValue = (event.target as HTMLInputElement).value;
    const newValue = currentValue + inputChar;

    // Test the pattern against the new value
    if (!pattern.test(newValue)) {
      event.preventDefault();
      return false;
    }
    return true;
  }


}
