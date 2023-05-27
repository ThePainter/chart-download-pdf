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

  ngOnInit() {
    setTimeout(() => {
      let rectElements = Array.from(document.getElementsByTagName('rect'));
      if (rectElements.length > 0) {
        rectElements.forEach((rect) => {
          rect.setAttribute('fill', '#ffffff');
        });
      }
      // Charts are now rendered
      const chart = document.getElementById('chart');
      html2canvas(chart, {
        height: 1000,
        width: 1000,
        scale: 3,
        backgroundColor: null,
        logging: false,
        onclone: (document) => {
          document.getElementById('chart').style.visibility = 'visible';
        },
      }).then((canvas) => {
        // Get chart data so we can append to the pdf
        const chartData = canvas.toDataURL();
        // Prepare pdf structure
        const docDefinition = {
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

        // Add some content to the pdf
        const title = {
          text: 'Here is the export of charts to the PDF',
          style: 'subheader',
        };
        const description = { text: 'Some description', style: 'subsubheader' };
        docDefinition.content.push(title);
        docDefinition.content.push(description);
        // Push image of the chart
        docDefinition.content.push({ image: chartData, width: 500 });
        this.docDefinition = docDefinition;
        //pdfMake.createPdf(docDefinition).download('chartToPdf' + '.pdf');
      });
    }, 1100);
  }

  onSelect(event) {
    console.log(event);
  }

  /*rederBarChart() {
    html2canvas(document.getElementById('barChart'), { height: 500 }).then(
      (canvas) => {
        document.body.appendChild(canvas);
      }
    );
  }

  rederGroupedBarChart() {
    html2canvas(document.getElementById('groupedBarChart'), {
      height: 500,
    }).then((canvas) => {
      document.body.appendChild(canvas);
    });
  }*/

  downloadChart() {
    // Download PDF
    if (this.docDefinition) {
      pdfMake.createPdf(this.docDefinition).download('chartToPdf' + '.pdf');
    } else {
      console.log('Chart is not yet rendered!');
    }
  }
}
