// ===================================================================
// Author: Matt Kruse <matt@mattkruse.com>
// WWW: http://www.mattkruse.com/
//
// NOTICE: You may use this code for any purpose, commercial or
// private, without any further permission from the author. You may
// remove this notice from your final code if you wish, however it is
// appreciated by the author if at least my web site address is kept.
//
// You may *NOT* re-distribute this code in any way except through its
// use. That means, you can include it in your product, or your web
// site, or any other form where the code is actually being used. You
// may not put the plain javascript up on your site for download or
// include it in your javascript libraries for download. 
// If you wish to share this code with others, please just point them
// to the URL instead.
// Please DO NOT link directly to my .js files from your site. Copy
// the files to your server and use them there. Thank you.
// ===================================================================

// HISTORY
// ------------------------------------------------------------------
// May 17, 2003: Fixed bug in parseDate() for dates <1970
// March 11, 2003: Added parseDate() function
// March 11, 2003: Added "NNN" formatting option. Doesn't match up
//                 perfectly with SimpleDateFormat formats, but 
//                 backwards-compatability was required.

// ------------------------------------------------------------------
// These functions use the same 'format' strings as the 
// java.text.SimpleDateFormat class, with minor exceptions.
// The format string consists of the following abbreviations:
// 
// Field        | Full Form          | Short Form
// -------------+--------------------+-----------------------
// Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
// Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
//              | NNN (abbr.)        |
// Day of Month | dd (2 digits)      | d (1 or 2 digits)
// Day of Week  | EE (name)          | E (abbr)
// Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
// Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
// Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
// Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
// Minute       | mm (2 digits)      | m (1 or 2 digits)
// Second       | ss (2 digits)      | s (1 or 2 digits)
// AM/PM        | a                  |
//
// NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
// Examples:
//  "MMM d, y" matches: January 01, 2000
//                      Dec 1, 1900
//                      Nov 20, 00
//  "M/d/yy"   matches: 01/20/00
//                      9/2/00
//  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
// ------------------------------------------------------------------

import { Injectable } from '@angular/core';
import {Response, Http, Headers, RequestOptions, ResponseContentType} from "@angular/http";
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import * as FileSaver from 'file-saver'; 

@Injectable()
export class ABSFunctions {

constructor(private http: Http) {

  }
    private MONTH_NAMES = new Array(
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
    private DAY_NAMES = new Array(
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

    LZ(x) {
        return (x < 0 || x > 9 ? "" : "0") + x
    }

// ------------------------------------------------------------------
// isDate ( date_string, format_string )
// Returns true if date string matches format of format string and
// is a valid date. Else returns false.
// It is recommended that you trim whitespace around the value before
// passing it to this function, as whitespace is NOT ignored!
// ------------------------------------------------------------------

    isDate(val, format) {
        let date = this.getDateFromFormat(val, format);
        if (date == 0) { return false; } return true;
    }

// -------------------------------------------------------------------
// compareDates(date1,date1format,date2,date2format)
//   Compare two date strings to see which is greater.
//   Returns:
//   1 if date1 is greater than date2
//   0 if date2 is greater than date1 of if they are the same
//  -1 if either of the dates is in an invalid format
// -------------------------------------------------------------------

    compareDates(date1, dateformat1, date2, dateformat2) {
        let d1 = this.getDateFromFormat(date1, dateformat1);
        let d2 = this.getDateFromFormat(date2, dateformat2);
        if (d1 == 0 || d2 == 0) {
            return -1;
        } else if (d1 > d2) {
            return 1;
        }
        return 0;
    }

// ------------------------------------------------------------------
// formatDate (date_object, format)
// Returns a date in the output format specified.
// The format string uses the same abbreviations as in getDateFromFormat()
// ------------------------------------------------------------------

    formatDate(date: any, format: string) {
      //  console.log(date);
        date = new Date(date);
       // date = Date.parse(date);
      //  console.log(date);
        format = format + "";
        let result = "";
        let i_format = 0;
        let c = "";
        let token = "";
        let y = date.getFullYear() + "";
        let M = date.getMonth() + 1;
        let d = date.getDate();
        let E = date.getDay();
        let H = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        let yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, KK, K, kk, k;
        let value = new Object();
        if (y.length < 4) {
            y = "" + (parseInt(y) - 0 + 1900);
        }
        value["y"] = "" + y;
        value["yyyy"] = y;
        value["yy"] = y.substring(2, 4);
        value["M"] = M;
        value["MM"] = this.LZ(M);
        value["MMM"] = this.MONTH_NAMES[M - 1];
        value["NNN"] = this.MONTH_NAMES[M + 11];
        value["d"] = d;
        value["dd"] = this.LZ(d);
        value["E"] = this.DAY_NAMES[E + 7];
        value["EE"] = this.DAY_NAMES[E];
        value["H"] = H;
        value["HH"] = this.LZ(H);
        if (H == 0) {
            value["h"] = 12;
        } else if (H > 12) {
            value["h"] = H - 12;
        } else {
            value["h"] = H;
        }
        value["hh"] = this.LZ(value["h"]);
        if (H > 11) {
            value["K"] = H - 12;
        } else {
            value["K"] = H;
        }
        value["k"] = H + 1;
        value["KK"] = this.LZ(value["K"]);
        value["kk"] = this.LZ(value["k"]);
        if (H > 11) {
            value["a"] = "PM";
        } else {
            value["a"] = "AM";
        }
        value["m"] = m;
        value["mm"] = this.LZ(m);
        value["s"] = s;
        value["ss"] = this.LZ(s);
        while (i_format < format.length) {
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            if (value[token] != null) {
                result = result + value[token];
            } else {
                result = result + token;
            }
        }
        return result;
    }

// ------------------------------------------------------------------
// Utility functions for parsing in getDateFromFormat()
// ------------------------------------------------------------------
    _isInteger(val) { 
        let digits = "1234567890"; 
        for (let i = 0; i < val.length; i++) {
            if (digits.indexOf(val.charAt(i)) == -1) {
                return false; 
            } 
        } 
        return true; 
    }

    _getInt(str, i, minlength, maxlength) { 
        for (let x = maxlength; x >= minlength; x--) { 
            let token = str.substring(i, i + x); 
            if (token.length < minlength) { 
                return null; 
            } 
            if (this._isInteger(token)) {
                return token; 
            } 
        } 
        return null; 
    }

// ------------------------------------------------------------------
// getDateFromFormat( date_string , format_string )
//
// This function takes a date string and a format string. It matches
// If the date string matches the format string, it returns the 
// getTime() of the date. If it does not match, it returns 0.
// ------------------------------------------------------------------

    getDateFromFormat(val, format) {
        val = val + "";
        format = format + "";
        let i_val = 0;
        let i_format = 0;
        let c = ""; var token = "";
        let token2 = "";
        let x, y;
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let date = 1;
        let hh = now.getHours();
        let mm = now.getMinutes();
        let ss = now.getSeconds();
        let ampm = "";
        while (i_format < format.length) {
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            if (token == "yyyy" || token == "yy" || token == "y") {
                if (token == "yyyy") {
                    x = 4; y = 4;
                }
                if (token == "yy") {
                    x = 2; y = 2;
                } if (token == "y") {
                    x = 2; y = 4;
                }
                year = this._getInt(val, i_val, x, y);
                if (year == null) {
                    return 0;
                }
                i_val += year.toString().length;
                if (year.toString().length == 2) {
                    if (year > 70) {
                        year = 1900 + (year - 0);
                    } else {
                        year = 2000 + (year - 0);
                    }
                }
            } else if (token == "MMM" || token == "NNN") {
                month = 0;
                for (let i = 0; i < this.MONTH_NAMES.length; i++) {
                    let month_name = this.MONTH_NAMES[i];
                    if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                        if (token == "MMM" || (token == "NNN" && i > 11)) {
                            month = i + 1; if (month > 12) {
                                month -= 12;
                            }
                            i_val += month_name.length; break;
                        }
                    }
                }
                if ((month < 1) || (month > 12)) {
                    return 0;
                }
            } else if (token == "EE" || token == "E") {
                for (let i = 0; i < this.DAY_NAMES.length; i++) {
                    let day_name = this.DAY_NAMES[i];
                    if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                        i_val += day_name.length;
                        break;
                    }
                }
            } else if (token == "MM" || token == "M") {
                month = this._getInt(val, i_val, token.length, 2);
                if (month == null || (month < 1) || (month > 12)) {
                    return 0;
                }
                i_val += month.toString().length;
            } else if (token == "dd" || token == "d") {
                date = this._getInt(val, i_val, token.length, 2);
                if (date == null || (date < 1) || (date > 31)) {
                    return 0;
                }
                i_val += date.toString().length;
            } else if (token == "hh" || token == "h") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 12)) {
                    return 0;
                }
                i_val += hh.toString().length;
            } else if (token == "HH" || token == "H") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 23)) {
                    return 0;
                }
                i_val += hh.toString().length;
            } else if (token == "KK" || token == "K") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 11)) {
                    return 0;
                }
                i_val += hh.toString().length;
            } else if (token == "kk" || token == "k") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 24)) {
                    return 0;
                }
                i_val += hh.toString().length;
                hh--;
            } else if (token == "mm" || token == "m") {
                mm = this._getInt(val, i_val, token.length, 2);
                if (mm == null || (mm < 0) || (mm > 59)) {
                    return 0;
                }
                i_val += mm.toString().length;
            } else if (token == "ss" || token == "s") {
                ss = this._getInt(val, i_val, token.length, 2);
                if (ss == null || (ss < 0) || (ss > 59)) {
                    return 0;
                }
                i_val += ss.toString().length;
            } else if (token == "a") {
                if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
                    ampm = "AM";
                } else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
                    ampm = "PM";
                } else {
                    return 0;
                }
                i_val += 2;
            } else {
                if (val.substring(i_val, i_val + token.length) != token) {
                    return 0;
                } else {
                    i_val += token.length;
                }
            }
        }
        if (i_val != val.length) {
            return 0;
        }
        if (month == 2) {
            if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
                if (date > 29) {
                    return 0;
                }
            } else {
                if (date > 28) {
                    return 0;
                }
            }
        }
        if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
            if (date > 30) {
                return 0;
            }
        }
        if (hh < 12 && ampm == "PM") {
            hh = hh - 0 + 12;
        } else if (hh > 11 && ampm == "AM") {
            hh -= 12;
        }
        let newdate = new Date(year, month - 1, date, hh, mm, ss);
        return newdate.getTime();
    }

// ------------------------------------------------------------------
// parseDate( date_string [, prefer_euro_format] )
//
// This function takes a date string and tries to match it to a
// number of possible date formats to get the value. It will try to
// match against the following international formats, in this order:
// y-M-d   MMM d, y   MMM d,y   y-MMM-d   d-MMM-y  MMM d
// M/d/y   M-d-y      M.d.y     MMM-d     M/d      M-d
// d/M/y   d-M-y      d.M.y     d-MMM     d/M      d-M
// A second argument may be passed to instruct the method to search
// for formats like d/M/y (european format) before M/d/y (American).
// Returns a Date object or null if no patterns match.
// ------------------------------------------------------------------

    parseDate(val) {
        let preferEuro = (arguments.length == 2) ? arguments[1] : false;
        let generalFormats = new Array('y-M-d', 'MMM d, y', 'MMM d,y', 'y-MMM-d', 'd-MMM-y', 'MMM d');
        let monthFirst = new Array('M/d/y', 'M-d-y', 'M.d.y', 'MMM-d', 'M/d', 'M-d');
        let dateFirst = new Array('d/M/y', 'd-M-y', 'd.M.y', 'd-MMM', 'd/M', 'd-M');
        let checkList = new Array('generalFormats', preferEuro ? 'dateFirst' : 'monthFirst', preferEuro ? 'monthFirst' : 'dateFirst');
        let d = null;
        for (let i = 0; i < checkList.length; i++) {
            let l = window[checkList[i]];
            for (let j = 0; j < l.length; j++) {
                d = this.getDateFromFormat(val, l[j]);
                if (d != 0) {
                    return new Date(d);
                }
            }
        } return null;
    }
}
