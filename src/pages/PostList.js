import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Post from "../components/Post.js";
import { actionCreators as postActions } from "../redux/modules/post.js";


const PostList = (props) => {
    const post_list = useSelector((state) => state.post.list);
    const dispatch = useDispatch();
    const user_info = useSelector((state) => state.user.user);

    useEffect(() => {

        if (post_list.length === 0) {
            dispatch(postActions.getPostFB());
        }
    }, []);
    return (
        <React.Fragment>
            {/* <Post/> */}
            {post_list.map((p, idx) => {
                if(p.user_info.user_id === user_info.uid){
                    return <Post key={p.id} {...p} is_me/>;
                }else{
                    return <Post key={p.id} {...p}/>;
                }
                
            })}
        </React.Fragment>
    )
}

export default PostList;