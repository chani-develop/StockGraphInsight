import { Component ,EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent {

  chosenCompany : string = 'GOOG';
  @Output() companySelected = new EventEmitter<string>();

selectCompany(company:string){
  this.companySelected.emit(company);
  this.chosenCompany = company;
  console.log(company);

}


getSymbol(company: string): string {
  switch (company) {
    case 'AAPL': return 'Apple';
    case 'MSFT': return 'Microsoft';
    case 'GOOG': return 'Alphabet';
    case 'AMZN': return 'Amazon';
    case 'TSLA': return 'Tesla';
    case 'AVGO': return 'Broadcom';
    case 'AMD':  return 'Advanced';
    case 'INTC': return 'Intel';
    case 'META': return 'Meta';
    case 'NVDA': return 'NVIDIA';
    case 'NFLX': return 'Netflix';
    default:     return company;
  }
}
}