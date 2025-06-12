

import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [ 
    FormsModule, CommonModule],
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent {
  @Output() rangeSelected: EventEmitter<string> = new EventEmitter<string>();

  chosenRange: string = 'lastweek';
  chosenRangeHebrew: string = 'שבוע';
  isDropdownOpen: boolean = false;


  selectedRange: string = 'lastweek'; // חדש – נבחרת ברירת מחדל

  selectRange(range: string) {
    this.chosenRange = range;
    this.chosenRangeHebrew = this.getRangeInHebrew(range);
    this.rangeSelected.emit(range);
  }

  getRangeInHebrew(range: string): string {
    switch (range) {
      case 'today': return 'היום';
      case 'lastyear': return 'שנה';
      case 'last30days': return '30 ימים';
      case 'last6months': return 'חצי שנה';
      case 'lastweek': return 'שבוע';
      default: return 'טווח לא ידוע';
    }
  }
}
