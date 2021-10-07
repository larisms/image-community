import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Post from "../components/Post.js";
import Grid from "../elements/Grid.js";
import { actionCreators as postActions } from "../redux/modules/post.js";
import InfinityScroll from "../shared/InfinityScroll.js";


const PostList = (props) => {
    const post_list = useSelector((state) => state.post.list);
    const dispatch = useDispatch();
    const user_info = useSelector((state) => state.user.user);
    const is_loading = useSelector((state) => state.post.is_loading);
    const paging = useSelector((state) => state.post.paging);

    const { history } = props;

    useEffect(() => {
        //포스트 리스트가 0일때만 파이어스토어에서 목록을 가져왔기 때문에 포스트리스트가 1개가 될 경우 불러오지 않는다. 그래서 <2 로 바꿈.
        if (post_list.length < 2) {
            dispatch(postActions.getPostFB());
        }
    }, []);
    return (
        <React.Fragment>
            <Grid bg={"#EFF6FF"} padding="20px 0px">
                {/* <Post/> */}
                <InfinityScroll
                    callNext={() => {
                        dispatch(postActions.getPostFB(paging.next))
                    }}
                    is_next={paging.next ? true : false}
                    loading={is_loading}
                >
                    {post_list.map((p, idx) => {
                        //옵셔널 체이닝
                        if (p.user_info.user_id === user_info?.uid) {
                            return (
                                //키는 원래 포스트가 갖고 있었으나, 포스트가 그리드 밑에 들어가면서 그리드가 가질수 있도록 변경.
                                <Grid bg="#ffffff"
                                    key={p.id}
                                    _onClick={() => {
                                        history.push(`/post/${p.id}`);
                                    }}>
                                    <Post {...p} is_me />
                                </Grid>
                            );
                        } else {
                            return (
                                <Grid
                                    key={p.id}
                                    _onClick={() => {
                                        history.push(`/post/${p.id}`);
                                    }}>
                                    <Post {...p} />
                                </Grid>
                            );
                        }
                    })}
                </InfinityScroll>
            </Grid>
        </React.Fragment>
    )
}

export default PostList;