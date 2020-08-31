import AbstractSmartComponent from '@/components/abstract-smart-component';
import {getDuration, getUniqueItems} from '@/utils/common';
import {HIDDEN_CLASS} from '@/const';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

const CHART_TYPE = `horizontalBar`;

const ChartTitle = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME SPENT`,
};

const Bar = {
  HEIGHT: 55,
  THICKNESS: 44,
  MIN_LENGTH: 50,
  BG_COLOR: `#ffffff`,
  HOVER_BG_COLOR: `#ffffff`,
};

const InBarText = {
  COLOR: `#000000`,
  POSITION: `end`,
  ALIGN: `start`,
  FONT_SIZE: 13,
};

const Title = {
  FONT_COLOR: `#000000`,
  FONT_SIZE: 23,
  POSITION: `left`,
};

const Label = {
  FONT_COLOR: `#000000`,
  PADDING: 5,
  FONT_SIZE: 13,
  POSITION: `start`,
};

const createChartSettings = ({
  title,
  labels,
  barsData,
  barCaptionFormatter,
}) => {

  return {
    plugins: [ChartDataLabels],
    type: CHART_TYPE,
    data: {
      labels,
      datasets: [{
        data: barsData,
        backgroundColor: Bar.BG_COLOR,
        hoverBackgroundColor: Bar.HOVER_BG_COLOR,
        anchor: Label.POSITION,
        barThickness: Bar.THICKNESS,
        minBarLength: Bar.MIN_LENGTH,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: InBarText.FONT_SIZE,
          },
          color: InBarText.COLOR,
          anchor: InBarText.POSITION,
          align: InBarText.ALIGN,
          formatter: barCaptionFormatter,
        }
      },
      title: {
        display: true,
        text: title,
        fontColor: Title.FONT_COLOR,
        fontSize: Title.FONT_SIZE,
        position: Title.POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Label.FONT_COLOR,
            padding: Label.PADDING,
            fontSize: Label.FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  };
};


const getChartsData = (events, transferTypes) => {
  const types = getUniqueItems(events.map((event) => event.type));

  const eventsByTypes = [];
  types.forEach((type) => {
    eventsByTypes.push({type, events: events.filter((event) => event.type === type)});
  });

  const getMoneyByType = (eventsByType) => {
    return eventsByType.reduce((total, event) => total + event.price, 0);
  };

  const getTransferCountsByType = () => {
    const transfers = eventsByTypes.filter((it) => transferTypes.includes(it.type));
    return {
      types: transfers.map((it) => it.type),
      counts: transfers.map((it) => it.events.length),
    };
  };

  const getTimeByType = (eventsByType) => {
    return eventsByType.reduce((total, event) => {
      return total + moment.duration(event.dateEnd - event.dateStart);
    }, moment.duration(0));
  };

  return {
    types,
    money: eventsByTypes.map((it) => getMoneyByType(it.events)),
    transport: getTransferCountsByType(),
    time: eventsByTypes.map((it) => getTimeByType(it.events)),
  };
};

const createStatsTemplate = () => {
  return (
    `<section class="statistics visually-hidden">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

const renderMoneyChart = (moneyCtx, chartsData) => {
  const barsAmount = chartsData.types.length;
  moneyCtx.height = Bar.HEIGHT * barsAmount;

  return new Chart(moneyCtx, createChartSettings({
    title: ChartTitle.MONEY,
    labels: chartsData.types,
    barsData: chartsData.money,
    barCaptionFormatter: (val) => `€ ${val}`,
  }));
};

const renderTransportChart = (transportCtx, chartsData) => {
  const barsAmount = chartsData.transport.types.length;
  transportCtx.height = Bar.HEIGHT * barsAmount;

  return new Chart(transportCtx, createChartSettings({
    title: ChartTitle.TRANSPORT,
    labels: chartsData.transport.types,
    barsData: chartsData.transport.counts,
    barCaptionFormatter: (val) => `${val}x`,
  }));
};

const renderTimeSpentChart = (timeSpentCtx, chartsData) => {
  const barsAmount = chartsData.types.length;
  timeSpentCtx.height = Bar.HEIGHT * barsAmount;

  return new Chart(timeSpentCtx, createChartSettings({
    title: ChartTitle.TIME,
    labels: chartsData.types,
    barsData: chartsData.time,
    barCaptionFormatter: (val) => getDuration(val),
  }));
};

export default class Stats extends AbstractSmartComponent {
  constructor(eventsModel) {
    super();
    this._eventsModel = eventsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;
  }

  getTemplate() {
    return createStatsTemplate();
  }

  hide() {
    this.getElement().classList.add(HIDDEN_CLASS);
  }

  show() {
    this.getElement().classList.remove(HIDDEN_CLASS);
  }

  rerender() {
    super.rerender();

    this._renderCharts();
  }

  recoverListeners() {}

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpentChart) {
      this._timeSpentChart.destroy();
      this._timeSpentChart = null;
    }
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpentCtx = element.querySelector(`.statistics__chart--time`);

    const events = this._eventsModel.getEventsAll();
    const transferTypes = Array.from(this._eventsModel.getOffers().TRANSFER.keys());

    this._resetCharts();

    const chartsData = getChartsData(events, transferTypes);

    this._moneyChart = renderMoneyChart(moneyCtx, chartsData);
    this._transportChart = renderTransportChart(transportCtx, chartsData);
    this._timeSpentChart = renderTimeSpentChart(timeSpentCtx, chartsData);
  }
}
