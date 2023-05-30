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
      pageMargins: [40, 60, 40, 40],
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
        gray: {
          color: '#555555',
        },
        rightme: {
          alignment: 'right',
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
      footer: function (currentPage, pageCount) {
        return [
          {
            margin: 10,
            columns: [
              {
                text: currentPage.toString() + ' / ' + pageCount,
                style: 'rightme',
              },
            ],
          },
        ];
      },
      header: function (currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element
        return [
          {
            margin: 10,
            columns: [
              {
                text: '',
                style: 'gray',
              },
              {
                // usually you would use a dataUri instead of the name for client-side printing
                // sampleImage.jpg however works inside playground so you can play with it
                image:
                  'data:image/png;base64,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',
                width: 70,
              },
            ],
          },
        ];
      },
    };
  }
}
