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
            menuActive: '',
            modalOrder: {
                isOpen: false,
            },
            price: 0,
            scrollPos: 0,
            isCoreLoading: true,
            isMobile: false,
            currency: '₽',
        },
        computed: {
            
        },
        created: function() {
            let self = this;

            // check for mobile
            window.innerWidth <= 666 ? self.isMobile = true : self.isMobile = false;
        },
        mounted: function() {
            // preloader
            setTimeout(() => {
                this.isCoreLoading = false;
            }, 1000);

            this.$nextTick(function () {
                // set menu active
                this.menuActive = this.mainData[0].Title;
                // get all menu offsetTop
                this.mainData.map(element => {
                    let elemOffsetTop = App.querySelector(`section[data-title='${ element.Title }']`).offsetTop;

                    return element.offsetTop = elemOffsetTop;
                });
            });
            
            
            // scroll + menu
            App.addEventListener('scroll', () => {
                let halfScreen = App.offsetHeight / 2;
                let scrolledBy = App.scrollTop;
                let scrollDirection = true; // true = down, false = up

                scrolledBy > this.scrollPos ? scrollDirection = true : scrollDirection = false;
                
                for (let i = 0; i < this.mainData.length; i++) {
                    let val = 0;
                    scrollDirection ? val = this.mainData[i].offsetTop - halfScreen : val = this.mainData[i].offsetTop + halfScreen;

                    if (Math.abs(scrolledBy - val) < 100) {
                        this.menuActive = this.mainData[i].Title;
                        break;
                    };
                };

                this.scrollPos = scrolledBy;
            });
        },
        beforeUpdate: function() {

        },
        methods: {
            goToMenu: function(title) {
                let target = document.querySelector(`section.menu__position[data-title='${ title }']`).offsetTop;
                let menu = document.querySelector(`section.menu`).offsetHeight;
                let scrollLength = target - menu;

                App.scrollTo({ top: scrollLength, behavior: 'smooth' });
            },
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
    let iterator = 2;

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