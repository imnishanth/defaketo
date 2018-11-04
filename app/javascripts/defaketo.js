//import * as helper from "./helper.js";
import bloomFilter from "./jsHelpers/bloomFilter.js";
import $ from "jquery";

var bloom = new bloomFilter.BloomFilter(
        32 * 256, // number of bits to allocate.
        16        // number of hash functions.
    );

//var bloom = new Array(bloomVal);


export function initApp() {
    displayFeed();

    //Setup account number
    if (web3 == undefined || !web3.eth.accounts.length) {
        $("#acctName").val("Please enable Metamask");
    }
    else {
        $("#acctName").val(web3.eth.coinbase);
    }
}

export function postNews() {
    var tag = new Array($("#tagName").value);
    var news = new Array($("#newsContent").value);
    var author = new Array($("#newsAuth").value);
    var id = new Array(helper.hashCode(web3.eth.coinbase + new Date().toLocaleString()));
    var dVotes = new Array("0");
    var uVotes = new Array("0");
    //var bloomVal = new bloomFilter.BloomFilter(
    //    32 * 256, // number of bits to allocate.
    //    16        // number of hash functions.
    //);
    var bloom = new Array(bloomVal);

    var instance = createNewsFeedInstance();
    var estimatedGas = 6654755;

    var txnObject = {
        from: web3.eth.coinbase,
        gas: estimatedGas
    }

    instance.addNews.sendTransaction(id, dVotes, uVotes, author, bloom, news,
        tag, 1, txnObject, function (error, result) {
            if (!error) {
                console.warn(result);
            }
            else {
                console.log("Error");
            }
        });

    generateNewsFeed();
}



export function addPost() {
    var post = $("#postContent").value;
    var author = $("#postAuth").value;
    var postId = $("#mainNewsId").value;
    //var bloomVal = new bloomFilter.BloomFilter(
    //    32 * 256, // number of bits to allocate.
    //    16        // number of hash functions.
    //);
    //var bloom = new Array(bloomVal);
    var dVotes = "0";
    var uVotes = "0";
    var authAddr = web3.eth.coinbase;
    var id = new Array(helper.hashCode(web3.eth.coinbase
        + new Date().toLocaleString()));

    var instance = createPostFeedInstance();
    var estimatedGas = 6654755;

    var txnObject = {
        from: web3.eth.coinbase,
        gas: estimatedGas
    }

    instance.addPost.sendTransaction(postId, id, dVotes, uVotes, author, authAddr,
        bloom, post, txnObject, function (error, result) {
            if (!error) {
                console.warn(result);
            }
            else {
                console.log("Error");
            }
        });

    generatePost(this, postId);
}

export function voteUp(el, postId) {
    if (!bloom.test(web3.eth.coinbase)) {
        el.firstElementChild.textContent++;

        var instance = createNewsFeedInstance();
        var estimatedGas = 6654755;

        var txnObject = {
            from: web3.eth.coinbase,
            gas: estimatedGas
        }

        instance.voteUp.sendTransaction(postId, el.firstElementChild.textContent,
            function (error, result) {
                if (!error) {
                    console.warn(result);
                }
                else {
                    console.log("Error");
                }
            });
    }
}

export function votePostUp(el, address) {
    if (!bloom.test(web3.eth.coinbase)) {
        el.firstElementChild.textContent++;

        var txnObject = {
            from: web3.eth.coinbase,
            to: address,
            value: web3.toWei(0.05, 'ether')
        }

        web3.eth.sendTransaction(txnObject, function (error, result) {
            if (!error) {
                console.warn('Thank you for your contribution');
            }
            else {
                console.log('Error');
            }
        });
    }
}

export function voteDown(el) {
    if (!bloom.test(web3.eth.coinbase)) {
        el.firstElementChild.textContent++;
    }
}

export function generatePost(el, postId) {
    displayPostFeed(postId);

    var instance = createPostFeedInstance();

    instance.getFeed.call(postId, function (error, result) {
        if (!error) {
            renderPostFeed(result);
        }
        else {
            console.log("Error");
        }
    });
}

export function displayPostFeed(postId) {
    $("#newsFeed").hide();
    $("#addNews").hide();
    $("#postFeed").show();
    $("#addPost").hide();

    $("#mainNewsId").text(postId);
}

export function displayFeed() {
    $("#postFeed").hide();
    $("#newsFeed").show();
    $("#addNews").hide();
    $("#addPost").hide();
}

export function displayAddNews() {
    $("#postFeed").hide();
    $("#newsFeed").hide();
    $("#addNews").show();
    $("#addPost").hide();
}

export function displayAddPost() {
    $("#postFeed").hide();
    $("#newsFeed").hide();
    $("#addNews").hide();
    $("#addPost").show();
}

function createNewsFeedInstance() {
    return helper.createContractInstance(JSON.stringify(newsFeedABI.abi), newsFeedABI.address);
}

function createPostFeedInstance() {
    return helper.createContractInstance(JSON.stringify(postFeedABI.abi), postFeedABI.address);
}

function generateNewsFeed(dVotes, posts, authors, upvotes, length) {
    displayFeed();

    var instance = createNewsFeedInstance();

    instance.getFeed.call(function (error, result) {
        if (!error) {
            renderNewsFeed(result);
        }
        else {
            console.log("Error");
        }
    });
}

function renderNewsFeed(result) {
    length = web3.toDecimal(web3.toHex(result[7]));

    var regEx = /[0]+$/;
    var content;

    //Remove extra 0s while converting back from bytes32
    for (var i = 0; i < length; i++) {
        for (var j = 0; j < 7; j++) {
            result[j][i] = web3.toAscii(result[j][i].replace(regEx, ""));
        }
    }
    var color;
    for (var i = 0; i < length; i++) {
        if(web3.toDecimal(web3.toHex(result[1][i])) <= web3.toDecimal(web3.toHex(result[2][i])))
            color = "#d4ffd5";
        else
            color = "#e0c6c6";

        content += "<tr style=\"background-color:"+ color + "\"><td class=\"minus\">";
        content += "<td class=\"minus\">";
        content += "<a href=\"#\" onclick=\"App.voteDown(this" + i + ")\" class=\"icon fa-minus-square\">";
        content += "<span>" + result[1][i] + "</span>";
        content += "</a></td>";
        content += "<td>" + result[5][i] + "</td>";
        content += "<td><a onclick=\"App.renderPost(this)\">" + result[6][i] + "</a></td>";
        content += "<td>" + result[3][i] + "</td>";
        content += "<td class=\"plus\">";
        content += "<a href=\"#\" onclick=\"App.voteUp(this" + i + ")\" class=\"icon fa-minus-square\">";
        content += "<span>" + result[2][i] + "</span>";
        content += "</a></td>";

        if (i == 0) {
            $('#newsFeedTbl tbody').append(content);
        }
        else {
            $('#newsFeedTbl tr:last').after(content);
        }
    }
}

function renderPostFeed(result) {
    length = web3.toDecimal(web3.toHex(result[7]));

    var regEx = /[0]+$/;
    var content;

    //Remove extra 0s while converting back from bytes32
    for (var i = 0; i < length; i++) {
        for (var j = 0; j < 7; j++) {
            result[j][i] = web3.toAscii(result[j][i].replace(regEx, ""));
        }
    }

    var color;
    for (var i = 0; i < length; i++) {
        if(web3.toDecimal(web3.toHex(result[2][i])) <= web3.toDecimal(web3.toHex(result[1][i])))
            color = "#d4ffd5";
        else
            color = "#e0c6c6";

        content += "<tr style=\"background-color:"+ color + "\"><td class=\"minus\">";
        content += "<a href=\"#\" onclick=\"App.voteDown(this, " + i +
            ")\" class=\"icon fa-minus-square\">";
        content += "<span>" + result[2][i] + "</span>";
        content += "</a></td>";
        content += "<td>" + result[6][i] + "</td>";
        content += "<td>" + result[3][i] + "</td>";
        content += "<td class=\"plus\">";
        content += "<a href=\"#\" onclick=\"App.voteUp(this, " + i + "," +
            result[4][i] + ")\" class=\"icon fa-minus-square\">";
        content += "<span>" + result[1][i] + "</span>";
        content += "</a></td></tr>";

        if (i == 0) {
            $('#postFeedTbl tbody').append(content);
        }
        else {
            $('#postFeedTbl tr:last').after(content);
        }
    }
}

function highlight() {

}




