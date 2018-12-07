<template>
  <div>
    <v-text-field
      v-model="search"
      append-icon="search"
      label="Search"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="prices"
      :rows-per-page-items="pagination"
      :search="search"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item['1. symbol'] }}</td>
        <td class="text-xs-center">{{ props.item['2. price'] }}</td>
        <td class="text-xs-center">
          <v-btn flat icon color="indigo" @click="trade(props.item['1. symbol'], props.item['2. price'])">
            <v-icon>attach_money</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-center">
          <v-btn flat icon color="indigo" @click="getStock(props.item['1. symbol'])">
            <v-icon>show_chart</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-center">
          <v-btn flat icon color="indigo" @click="getNews(props.item['1. symbol'])">
            <v-icon>receipt</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </div>

</template>


<script>
  import axios from 'axios'
  import {SandP100, staticPrices} from '../assets/data'

  const symbols = SandP100;
  const AV_API_KEY = 'VYWHI7043EUMUNW2';
  const INTRINIO_API_KEY = 'OjZhNWMxMTU2OWM1OGM1MDllODNjY2NkNmM4ZWUxNmVi';

  export default {
    name: 'Table',
    data() {
      return {
        headers: [
          {text: 'Symbol', value: '1. symbol', align: 'center', sortable: false, class: 'cyan'},
          {text: 'Price', value: '2. price', align: 'center', sortable: false, class: 'cyan'},
          {text: 'Trade', value: 'btn-trade', align: 'center', sortable: false, class: 'cyan'},
          {text: 'Chart', value: 'btn-chart', align: 'center', sortable: false, class: 'cyan'},
          {text: 'News', value: 'btn-news', align: 'center', sortable: false, class: 'cyan'},
        ],
        pagination: [ 10, 25, 50, { "text": "$vuetify.dataIterator.rowsPerPageAll", "value": -1 } ],
        prices: [],
        search: '',
      }
    },
    mounted() {
      this.getPrices();

      setInterval(() => {
        this.getPrices()
      }, 60000)
    },
    methods: {
      getPrices() {
        axios
          .get('https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=' + symbols + '&apikey=' + AV_API_KEY)
          .then(response => {
            this.prices = response.data['Stock Quotes']
          })
          .catch(error => {
            console.log(error)
          })
        // this.prices = JSON.parse(staticPrices);
      },
      trade(symbol, price) {
        this.$emit('trade', symbol, price);
      },
      getStock(symbol) {
        const TIME = '5min';

        axios
          .get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + symbol + '&interval=' + TIME + '&apikey=' + AV_API_KEY)
          .then(response => {
            const timeSeries = response.data['Time Series (' + TIME + ')'];
            this.$emit('stockDataPassed', timeSeries);
          })
          .catch(error => {
            console.log(error)
          })
      },
      getNews(symbol) {
        axios
          .get('https://api.intrinio.com/news?identifier=' + symbol + '&api_key=' + INTRINIO_API_KEY)
          .then(response => {
            const newsData = response.data.data;
            this.$emit('newsDataPassed', newsData[0]);
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
