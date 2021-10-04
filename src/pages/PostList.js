import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Post from "../components/Post.js";
import { actionCreators as postActions } from "../redux/modules/post.js";


const PostList = (props) => {
    const post_list = useSelector((state) => state.post.list);
    const dispatch = useDispatch();

    useEffect(() => {

        if (post_list.length === 0) {
            dispatch(postActions.getPostFB());
        }
    }, []);
    return (
        <React.Fragment>
            {/* <Post/> */}
            {post_list.map((p, idx) => {
                return <Post key={p.id} {...p} />
            })}
        </React.Fragment>
    )
}

export default PostList;