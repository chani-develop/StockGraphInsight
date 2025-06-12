
import { Component, Input, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as d3 from 'd3';
import html2canvas from 'html2canvas';
import { EmailService } from '../../service/email.service';
import { Canvg } from 'canvg';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnChanges {
  @Input() stockData: any[] = [];
  @Input() symbol!: string;
  @Input() range!: string;
  @ViewChild('svg', { static: false }) svgRef!: ElementRef<SVGElement>;


  loading: boolean = true;
  noData: boolean = true;
  firstTime: boolean = true;
  emailToSend: string = '';

  constructor(private emailService: EmailService) { }


  ngOnChanges() {
    this.loading = true;

    setTimeout(() => {
      if (!this.stockData || this.stockData.length === 0) {
        this.noData = true;
        this.loading = false;
        if (this.firstTime == false)
          return;
      }
      this.firstTime = false;
      this.noData = false;
      this.drawGraph();
      this.loading = false;
    }, 500);
  }

  getRangeInHebrew(range: string): string {
    switch (range) {
      case 'today': return 'היום';
      case 'last30days': return '30 ימים';
      case 'last6months': return 'חצי שנה';
      case 'lastweek': return 'שבוע';
      default: return 'טווח לא ידוע';
    }
  }


  getSymbol(company: string): string {
    switch (company) {
      case 'AAPL': return 'Apple';
      case 'MSFT': return 'Microsoft';
      case 'GOOG': return 'Google';
      case 'AMZN': return 'Amazon';
      case 'TSLA': return 'Tesla';
      case 'AVGO': return 'Broadcom';
      case 'AMD': return 'Advanced';
      case 'INTC': return 'Intel';
      case 'META': return 'Meta';
      case 'NVDA': return 'NVIDIA';
      case 'NFLX': return 'Netflix';

      default: return company;
    }
  }

  drawGraph() {
    if (!this.svgRef) return;
  
    const svg = d3.select(this.svgRef.nativeElement);
    svg.selectAll('*').remove();
  
    const width = 1200;
    const height = 600;
    const margin = { top: 40, right: 80, bottom: 60, left: 120 };
    const data = this.stockData;
  
    if (!data || data.length < 2) return;
  
    const first = data[0];
    const last = data[data.length - 1];
    const color = last.close >= first.close ? '#00e676' : '#ff5252';
  
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)) as [Date, Date])
      .range([margin.left, width - margin.right]);
  
    const y = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.close)! * 0.95,
        d3.max(data, d => d.close)! * 1.05
      ])
      .range([height - margin.bottom, margin.top]);
  
    const line = d3.line<any>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.close))
      .curve(d3.curveMonotoneX);
  
    const area = d3.area<any>()
      .x(d => x(new Date(d.date)))
      .y0(y(d3.min(data, d => d.close)! * 0.95))
      .y1(d => y(d.close))
      .curve(d3.curveMonotoneX);
  
    // גריד Y
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(
        d3.axisLeft(y)
          .ticks(6)
          .tickSize(-width + margin.left + margin.right)
      )
      .selectAll('text')
      .style('fill', '#eeeeee')
      .style('font-size', '16px');
  
    // גריד X
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(x)
          .ticks(6)
          .tickFormat((d: any) => d3.timeFormat('%d/%m')(new Date(d)))
      )
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('fill', '#eeeeee')
      .style('font-size', '16px');
  
    // אזור הצללה
    svg.append('path')
      .datum(data)
      .attr('fill', color + '33') // שקיפות
      .attr('d', area);
  
    // קו גרף
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 5)
      .attr('d', line);
  
    // טולטיפ
    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', '#222')
      .style('color', '#fff')
      .style('padding', '10px 14px')
      .style('border-radius', '8px')
      .style('font-size', '16px')
      .style('box-shadow', '0 2px 10px rgba(0,0,0,0.5)')
      .style('pointer-events', 'none')
      .style('opacity', 0);
  
    // נקודות
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', d => y(d.close))
      .attr('r', d => d === last ? 7 : 5)
      .attr('fill', d => d === last ? 'gold' : '#ffffff')
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(
          `<strong>תאריך:</strong> ${d3.timeFormat('%d/%m/%Y')(new Date(d.date))}<br/>
           <strong>מחיר:</strong> ${d.close}`
        )
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 40) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition().duration(300).style('opacity', 0);
      });
  
    // תוויות בעברית
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("תאריך")
      .attr("fill", "#ffffff")
      .attr("font-size", "18px");
  
    svg.append("text")
      .attr("x", -height / 2)
      .attr("y", 30)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("מחיר")
      .attr("fill", "#ffffff")
      .attr("font-size", "18px");
  }
  


// פונקציה אסינכרונית להורדת הגרף (SVG) כתמונה PNG
async downloadChartAsImage() {
  // מקבלת את אלמנט ה-SVG מתוך התבנית (HTML) בעזרת ViewChild
  const svgElement = this.svgRef.nativeElement;

  // יוצרת אלמנט Canvas חדש לציור
  const canvas = document.createElement('canvas');

  // קובעת את הגובה והרוחב של הקנבס לפי גודל ה-SVG, כפול 2 כדי לשפר את האיכות (רזולוציה גבוהה יותר)
  canvas.width = svgElement.clientWidth * 2;
  canvas.height = svgElement.clientHeight * 2;

  // מקבלת הקשר ציור דו-ממדי של הקנבס (2D context)
  const ctx = canvas.getContext('2d')!;

  // ממירה את אלמנט ה-SVG לטקסט בפורמט XML (מחרוזת)
  const svgString = new XMLSerializer().serializeToString(svgElement);

  // יוצרת אובייקט Canvg שמצייר את ה-SVG על הקנבס
  const v = Canvg.fromString(ctx, svgString, { ignoreMouse: true });

  // מריצה את הציור על הקנבס וממתינה שיסיים
  await v.start();

  // יוצרת אלמנט <a> (קישור) לצורך הורדת התמונה
  const link = document.createElement('a');

  // ממירה את הקנבס לתמונה PNG ומכניסה את הנתיב שלה לתוך הקישור
  link.href = canvas.toDataURL('image/png');

  // קובעת את שם הקובץ שיירד, לדוגמה: AAPL_7_ימים.png
  link.download = `${this.symbol}_${this.getRangeInHebrew(this.range)}.png`;

  // מפעילה לחיצה אוטומטית על הקישור – מה שגורם להורדת הקובץ
  link.click();
}


// פונקציה ששולחת מייל עם גרף כקובץ תמונה
async sendEmailWithChart() {
  // מאתרים את האלמנט של הגרף (ליתר ביטחון)
  const graphElement = document.getElementById('graph');
  if (!graphElement) return;

  // מקבלים את ה־SVG של הגרף בעזרת ViewChild (מוזן מ־this.svgRef)
  const svgElement = this.svgRef.nativeElement;

  // יוצרים קנבס חדש שיצייר את הגרף
  const canvas = document.createElement('canvas');
  // מגדילים את הרזולוציה פי 2 כדי לשפר את איכות התמונה
  canvas.width = svgElement.clientWidth * 2;
  canvas.height = svgElement.clientHeight * 2;

  // מקבלים את הקונקסט של הציור
  const ctx = canvas.getContext('2d')!;

  // ממירים את ה־SVG למחרוזת XML
  const svgString = new XMLSerializer().serializeToString(svgElement);

  // יוצרים אובייקט של Canvg שמצייר SVG על קנבס
  const v = Canvg.fromString(ctx, svgString, { ignoreMouse: true });

  // מוודאים שהציור הסתיים
  await v.start();

  // ממירים את הקנבס למחרוזת base64 שתייצג את התמונה (פורמט PNG)
  const imageBase64 = canvas.toDataURL('image/png');

  // שולחים את המייל עם התמונה לשרת דרך emailService
  this.emailService.sendEmail(this.emailToSend, imageBase64).subscribe({
    next: (response: any) => {
      console.log('Response:', response);
      alert(response.message || 'הדוא"ל נשלח בהצלחה!');
    },
    error: (error) => {
      console.error('SERVER ERROR:', error);
      alert('שגיאה בשליחת המייל: ' + error.message);
    }
  });
}

}
