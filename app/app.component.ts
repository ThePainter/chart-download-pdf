import { Component, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { single, multi } from './data';
import html2canvas from 'html2canvas';
declare var pdfMake: any;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  single: any[];
  multi: any[];
  docDefinition: any;

  view: any[] = [800, 400];
  viewHidden: any[] = [500, 200];

  // options
  xAxis = true;
  yAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Population';
  showYAxisLabel = true;
  yAxisLabel = 'Country';
  showGridLines = false;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor() {
    Object.assign(this, { single, multi });
  }

  ngOnInit() {}

  onSelect(event) {
    console.log(event);
  }

  async downloadChart() {
    // Prepare PDF
    this.prepareDocDefinition();
    this.generatePDFHeader();
    await this.insertChartSection('chart-section1', 'after');
    await this.insertChartSection('chart-section2', null);
    console.log(this.docDefinition.content);
    // Download PDF
    if (this.docDefinition) {
      pdfMake
        .createPdf(this.docDefinition)
        .download('chart-' + Date.now() + '.pdf');
    } else {
      console.log('Chart is not yet rendered!');
    }
  }

  async insertChartSection(section: string, pagebreak: string) {
    let rectElements = Array.from(document.getElementsByTagName('rect'));
    if (rectElements.length > 0) {
      rectElements.forEach((rect) => {
        rect.setAttribute('fill', '#ffffff');
      });
    }
    const chart = document.getElementById(section);
    await html2canvas(chart, {
      height: 550,
      width: 1000,
      scale: 1,
      backgroundColor: null,
      logging: false,
    }).then((canvas) => {
      console.log('YES');
      // Get chart data so we can append to the pdf
      const chartData = canvas.toDataURL();
      // Push image of the chart
      this.docDefinition.content.push({
        image: chartData,
        width: 500,
        pageBreak: pagebreak,
      });
    });
  }

  generatePDFHeader() {
    // Add some content to the pdf
    const title = {
      text: 'Here is the export of charts to the PDF',
      style: 'subheader',
    };
    const description = { text: 'Some description', style: 'subsubheader' };
    this.docDefinition.content.push(title);
    this.docDefinition.content.push(description);
  }

  prepareDocDefinition() {
    this.docDefinition = {
      content: [],
      styles: {
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
          alignment: 'left',
        },
        subsubheader: {
          fontSize: 12,
          italics: true,
          margin: [0, 10, 0, 25],
          alignment: 'left',
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
    };
  }
}
