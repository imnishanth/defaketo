pragma solidity ^0.4.2;

contract NewsFeed {
    struct Feed {
        bytes32[] ids;
        bytes32[] dVotes;
        bytes32[] uVotes;
        bytes32[] authors;
        bytes32[] bloomFilters;
        bytes32[] news;
        bytes32[] tags;
        uint count;
    }

    Feed private newsFeed;

    //For saving the news feed. Max limit of 1000 set accd to Solidity constraints
    function addNews(bytes32[1000] ids, bytes32[1000] dVotes, 
                     bytes32[1000] uVotes, bytes32[1000] authors,
                     bytes32[1000] blooms, bytes32[1000] news, bytes32[1000] tags, uint count)
    public
    returns (bool) {
        //Save the input in the Feed state
        newsFeed.count = count;

        for(uint i = 0; i < count; i++) {
            newsFeed.ids.push(ids[i]);
            newsFeed.dVotes.push(dVotes[i]);
            newsFeed.uVotes.push(uVotes[i]);
            newsFeed.authors.push(authors[i]);
            newsFeed.bloomFilters.push(blooms[i]);
            newsFeed.news.push(news[i]);
            newsFeed.tags.push(tags[i]);
        }

        return true;
    }

    //For retrieving the news feed. Max limit of 1000 set accd to Solidity constraints
    function getFeed()
    public
    payable
    returns(bytes32[1000] ids, bytes32[1000] dVotes, 
            bytes32[1000] uVotes, bytes32[1000] authors,
            bytes32[1000] blooms, bytes32[1000] tags, bytes32[1000] news, uint count) {
        count = newsFeed.count;

        for(uint i = 0; i < count; i++) {
            ids[i] = newsFeed.ids[i];
            dVotes[i] = newsFeed.dVotes[i];
            uVotes[i] = newsFeed.uVotes[i];
            authors[i] = newsFeed.authors[i];
            blooms[i] = newsFeed.bloomFilters[i];
            news[i] = newsFeed.news[i];
            tags[i] = newsFeed.tags[i];
        }
    }

    //For upvoting the news post
    function voteUp(uint postPos, bytes32 newVal)
    public
    payable
    returns(bytes32) {
        require(newsFeed.count != 0X0);

        newsFeed.uVotes[postPos] = newVal;

        return newVal;
    }

    //For downvoting the news post
    function voteDown(uint postPos, bytes32 newVal)
    public
    payable
    returns(bytes32) {
        require(newsFeed.count != 0X0);

        newsFeed.dVotes[postPos] = newVal;

        return newVal;
    }
}
