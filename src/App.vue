<template>
  <div id="app">
    <v-app>
      <v-container grid-list-md align-center="true">
        <v-layout row justify-space-between="true">
          <v-flex xs-6>
            <Table
              @stockDataPassed="onStockDataReceived"
              @newsDataPassed="onNewsReceived"
              @trade="setTradeData"
            ></Table>
          </v-flex>
          <v-flex xs-6>
            <Auth @registration="registration" v-if="this.uid === null"></Auth>
            <div v-else>

              <v-card>
                <v-card-title class="cyan"><h4 style="color: #ffffff">Your Balance</h4></v-card-title>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-tile v-for="(value, key, index) in userBalance" :key="index">
                    <v-list-tile-content>{{ key }}</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ value }}</v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>

              <v-card class="trade-form-wrapper">
                <v-form ref="trade" v-model="valid">
                  <v-card-text class="headline">
                    {{ this.tradeSymbol ? 'USD/' + this.tradeSymbol + ' - ' + this.tradePrice : 'Please select the symbol to trade' }}
                  </v-card-text>
                  <v-layout justify-space-around row>
                    <v-flex sm4>
                      <v-radio-group v-model="tradeType">
                        <v-radio
                          :label="'Buy'"
                          :value="'buy'"
                        ></v-radio>
                        <v-radio
                          :label="'Sell'"
                          :value="'sell'"
                        ></v-radio>
                      </v-radio-group>
                    </v-flex>

                    <v-flex sm4>
                      <v-text-field
                        v-model="volume"
                        :type="'number'"
                        :rules="volumeRules"
                        :disabled="!tradeSymbol"
                        label="Volume"
                        required
                      ></v-text-field>
                      <v-card-text>
                        Total deal amount: {{ total }}
                      </v-card-text>
                    </v-flex>
                  </v-layout>
                  <v-btn
                    @click="trade"
                    class="cyan"
                    style="color: #fff"
                  >
                    {{ this.tradeType }}
                  </v-btn>
                </v-form>
              </v-card>

            </div>
          </v-flex>
        </v-layout>
      </v-container>

      <!--CHART POPUP-->
      <v-dialog
        v-model="dialogChart"
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Chart
          </v-card-title>

          <div id="linechart_material"></div>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              flat
              @click="dialogChart = false"
            >
              close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--NEWS POPUP-->
      <v-dialog
        v-model="dialogNews"
        width="400"
      >
        <v-card v-model="dataNews">
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            {{ dataNews.title }}
          </v-card-title>

          <v-card-text>
            {{ dataNews.summary }}
          </v-card-text>

          <v-card-text class="text-xs-right font-italic">
            {{ dataNews.publication_date }}
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              flat
              @click="dialogNews = false"
            >
              close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<script>
  import Table from './components/Table'
  import Auth from './components/Auth'

  export default {
    name: 'App',
    props: ['initUid'],
    components: {
      Table,
      Auth
    },
    data() {
      return {
        uid: this.initUid,
        dialogChart: false,
        dialogNews: false,
        dataNews: {},
        userBalance: {
          USD: 1000
        },
        tradeSymbol: null,
        tradePrice: null,
        valid: true,
        volume: 0,
        volumeRules: [
          v => (v && v >= 1) || 'Volume must be more then 1',
          v => (this.tradeType === 'buy' ? parseFloat(this.total) < this.userBalance.USD : this.userBalance[this.tradeSymbol] && v < this.userBalance[this.tradeSymbol] )
            || 'You have not enough ' + (this.tradeType === 'buy' ? '$' : this.tradeSymbol)
        ],
        tradeType: 'buy',
      }
    },
    computed: {
      total: function () {
        if (this.volume && this.tradePrice)
          return this.volume * this.tradePrice + ' $';
        else
          return ' - ';
      }
    },
    methods: {
      onStockDataReceived(value) {
        google.charts.load('current', {'packages': ['line']});
        google.charts.setOnLoadCallback(drawChart);

        this.dialogChart = true;

        function drawChart() {
          const chartData = new google.visualization.DataTable();
          chartData.addColumn('string', 'Time');
          chartData.addColumn('number', 'open');
          chartData.addColumn('number', 'high');
          chartData.addColumn('number', 'low');
          chartData.addColumn('number', 'close');

          let data = [];

          Object.keys(value).forEach((key) => {
            let date = new Date(key);
            const dateOptions = {month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'};
            date = date.toLocaleDateString("en-US", dateOptions)

            let row = [date];

            Object.keys(value[key]).forEach((paramKey, index) => {
              if (index > 3) {
                return
              }
              row.push(parseFloat(value[key][paramKey]))
            });
            data.push(row);
          });
          chartData.addRows(data);

          const options = {
            chart: {
              title: 'Chart',
            },
            height: 500,
          };

          const chart = new google.charts.Line(document.getElementById('linechart_material'));
          chart.draw(chartData, google.charts.Line.convertOptions(options));
        }
      },
      onNewsReceived(value) {
        this.dialogNews = true;

        let dataNews = value;

        let date = new Date(dataNews.publication_date);
        const dateOptions = {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
        date = date.toLocaleDateString("en-US", dateOptions);
        dataNews.publication_date = date;

        this.dataNews = dataNews;
      },
      registration(uid) {
        this.uid = uid;
      },
      setTradeData(symbol, price) {
        this.tradeSymbol = symbol;
        this.tradePrice = parseFloat(price);
      },
      trade() {
        if (this.tradeType === 'buy') {
          this.userBalance.USD -= parseFloat(this.total);
          if (this.userBalance[this.tradeSymbol]) {
            this.userBalance[this.tradeSymbol] += this.volume;
          } else {
            this.userBalance[this.tradeSymbol] = this.volume;
          }
        } else {
          this.userBalance.USD += parseFloat(this.total);
          this.userBalance[this.tradeSymbol] -= this.volume;
        }
      }
    },
    watch: {
      initUid: function (newVal, oldVal) {
        this.uid = newVal;
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .v-form {
    width: 90%;
  }

  .form-auth {
    margin-left: 5%;
  }

  .trade-form-wrapper {
    margin-top: 20px;
  }

  th.cyan {
    color: #ffffff !important;
  }

  .v-tabs,
  .theme--light.v-table,
  .theme--light.v-card,
  .theme--light.v-list {
    background-color: rgba(0, 188, 212, 0.1);
  }

  .v-dialog .theme--light.v-card {
    background-color: #fff;
  }

  @media screen and (min-width: 1000px) {
    .flex.xs-6 {
      flex-basis: 50%;
      padding: 20px !important;
    }
  }

  @media only screen and (min-width: 1264px) {
    .container {
      max-width: 1400px;
    }
  }
</style>
