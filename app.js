import { AppService } from "./service.js?v=0.1";
import { appConfig } from "./config.js?v=0.1";

'use strict';

const Service = new AppService();
const config = appConfig();

let mainApp;
let cardsData = [];

(function() {

    // before init
    (() => {
        // get all async, then init()
        Promise.all([
            Service.get('test.xlsx', true),
        ]).then(function(data) { init(data); }).catch(function(err) { console.error(err); });
    })();

    // init
    function init(data) {
        let responseCardsData = data[0];

        getExcelData(responseCardsData).then(e => {
            let convertedData = convertExcelData(e);

            generateMenuAndCards(convertedData);
        
            doMainLogic();
    
            afterInit();
        });
    };

    // after init
    function afterInit() {
              
    };
}());

function doMainLogic() {
    // completed component
    Vue.component('menu-order', {
        props: ['price', 'currency'],
        data: function () {
            return {
                count: 0
            }
        },
        template: `<button class="menu__order" v-on:click="$emit('openModalOrder')">Заказ / {{ price }} {{ currency }}</button>`
    });

    mainApp = new Vue({
        el: '#App',
        data: {
            mainData: cardsData,
            modalOrder: {
                isOpen: false,
            },
            price: 0,
            isCoreLoading: true,
            isMobile: false,
            currency: '₽',
        },
        computed: {
            
        },
        created: function() {
            let self = this;
        },
        mounted: function() {
            setTimeout(() => {
                this.isCoreLoading = false;
            }, 1000);
        },
        beforeUpdate: function() {

        },
        methods: {

        }
    });
};

function getExcelData(e) {
    return new Promise((resolve, reject) => {
        let fileReader = new FileReader();

        fileReader.onload = () => {
          resolve(fileReader.result);
        };
    
        fileReader.onerror = reject;
    
        fileReader.readAsBinaryString(e);
    });
    
};

function convertExcelData(event) {
    let data = event;
    let workbook = XLSX.read(data, { type: "binary" } );

    // get info by sheet
    return XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
}

function generateMenuAndCards(data) {
    let iterator = 1;

    data.forEach(element => {
        if (element['Меню']) {
            cardsData.push(new CardsConstructor(element['Меню'], []));
        } else {
            element.id = iterator;
            cardsData[cardsData.length - 1]?.Data.push(element);
        };
        iterator++;
    });

    function CardsConstructor(name, arr) {
        this.Title = name;
        this.Data = arr;
    }

    console.log(cardsData);
};