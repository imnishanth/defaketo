pragma solidity ^0.4.2;

contract PostFeed {
    struct Feed {
        bytes32[] ids;
        bytes32[] dVotes;
        bytes32[] uVotes;
        bytes32[] authors;
        bytes32[] authorAddresses;
        bytes32[] bloomFilters;
        bytes32[] posts;
        uint count;
    }

    mapping(bytes32 => Feed) private postFeed;

    function addPost(bytes32 postId, bytes32 id, bytes32 dVotes, bytes32 uVotes,
                     bytes32 author, bytes32 authorAddr, bytes32 bloom, bytes32 post)
    public
    payable
    returns(bool) {
        postFeed[postId].ids.push(id);
        postFeed[postId].dVotes.push(dVotes);
        postFeed[postId].uVotes.push(uVotes);
        postFeed[postId].authors.push(author);
        postFeed[postId].authorAddresses.push(authorAddr); 
        postFeed[postId].bloomFilters.push(bloom); 
        postFeed[postId].posts.push(post);
        postFeed[postId].count++; 

        return true;
    }

    function getFeed(bytes32 postId)
    public
    payable
    returns(bytes32[1000] ids, bytes32[1000] uVotes, bytes32[1000] dVotes,
            bytes32[1000] authors, bytes32[1000] authAddresses, bytes32[1000] blooms,
            bytes32[1000] posts, uint count) {
        require(postFeed[postId].count != 0x0);

        count = postFeed[postId].count;

        for(uint i = 0; i < count; i++) {
            ids[i] = postFeed[postId].ids[i];
            dVotes[i] = postFeed[postId].dVotes[i];
            uVotes[i] = postFeed[postId].uVotes[i];
            authors[i] = postFeed[postId].authors[i];
            authAddresses[i] = postFeed[postId].authorAddresses[i];
            blooms[i] = postFeed[postId].bloomFilters[i];
            posts[i] = postFeed[postId].posts[i];
        }                      
    }

    //For upvoting the proof post
    function voteUp(bytes32 postId, uint postPos, bytes32 newVal)
    public
    payable
    returns(bytes32) {
        require(postFeed[postId].count != 0X0);

        postFeed[postId].uVotes[postPos] = newVal;

        return newVal;
    }

    //For downvoting the proof post
    function voteDown(bytes32 postId, uint postPos, bytes32 newVal)
    public
    payable
    returns(bytes32) {
        require(postFeed[postId].count != 0X0);

        postFeed[postId].dVotes[postPos] = newVal;

        return newVal;
    }
}
