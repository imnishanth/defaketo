import "../stylesheets/app.css";

import * as defake from "./defaketo.js";

window.App = {
    start: function () {
        defake.initApp();
    },
    voteUp: function(el) {
        defake.voteUp(el);
    },
    voteDown: function(el) {
        defake.voteDown(el);
    },
    generatePost: function(el) {
        defake.generatePost(el);
    },
    displayFeed: function() {
        defake.displayFeed();
    },
    displayAddNews: function() {
        defake.displayAddNews();
    },
    displayAddPost: function() {
        defake.displayAddPost();
    },
    displayPostFeed: function() {
        defake.displayPostFeed();
    }
};

window.addEventListener('load', function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        console.warn("Using web3 detected from external source")
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    }
    else {
        console.warn("No web3 detected. Falling back to http://127.0.0.1:8545");
        // Use port of local Geth Node
        window.web3 = new web3(new web3.providers.HttpProvider("http://127.0.0.1:8545"));
    }

    App.start();
});
