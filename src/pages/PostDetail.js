import React from "react";
import Post from "../components/Post";
import CommentList from "../components/CommnetList";
import CommentWrite from "../components/CommentWrite";


const PostDetail = (props) => {
    return (
        <React.Fragment>
            <Post/>
            <CommentWrite/>
            <CommentList/>
        </React.Fragment>
    )
}

export default PostDetail;