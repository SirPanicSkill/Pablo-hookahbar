import { AppService } from "./service.js?v=0.1";
import { AppFeatures } from "./features.js?v=0.1";
import { appConfig } from "./config.js?v=0.1";

'use strict';

const Service = new AppService();
const Features = new AppFeatures();
const config = appConfig();

(function() {

    // before init
    (() => {
        // _spPageContextInfo.userId == 29750 ? _spPageContextInfo.userId = 95 : _spPageContextInfo.userId; // Vet
        // _spPageContextInfo.userId == 29750 ? _spPageContextInfo.userId = 30759 : _spPageContextInfo.userId; // Galina
    })();
    
    init();

    // init
    function init() {
        
        doMainLogic();

        afterInit();
    };

    // after init
    function afterInit() {
              
    };
}());

function doMainLogic() {
    
};