import React, { useEffect, useState } from "react";
import { Grid, Image, Text } from "../elements";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators as commentActions } from "../redux/modules/comment";

const CommentList = (props) => {
    const dispatch = useDispatch();
    const comment_list = useSelector(state => state.comment.list);

    //프롭스에서 가지고 온 포스트 아이디 넘겨주는.
    const {post_id} = props;

    //처음에 리스트가 없었다면, 디스패치로 겟 코멘트 해줘야함. 맨처음에 한번만
    useEffect(() => {

        if(!comment_list[post_id]){
            dispatch(commentActions.getCommentFB(post_id));
        }
    },[]);

    //만약에 코멘트리스트에 포스트 아이디가 없을때, 또 포스트 아이디가 넘어오지 않았을 때도 널.
    if(!comment_list[post_id] || !post_id){
        return null;
    }

    return (
        <React.Fragment>
            <Grid padding="16px">
                {comment_list[post_id].map(c => {
                    return <CommentItem key={c.id} {...c}/>;
                })}
            </Grid>
        </React.Fragment>
    )
}

//프롭스 받아오는게 있기 때문에 디폴트값을 지정해준다는 개념.
CommentList.defaultProps = {
    post_id: null,
}

export default CommentList;


const CommentItem = (props) => {
    const {user_profile, nick, user_id, post_id, insert_dt, contents} = props;
    return(
        <Grid is_flex>
            <Grid is_flex width="auto">
                <Image shape="circle"/>
                <Text bold>{nick}</Text>
            </Grid>
            <Grid is_flex margin="0px 4px">
                <Text margin="0px">{contents}</Text>
                <Text margin="0px">{insert_dt}</Text>
            </Grid>
        </Grid>
    )
}


CommentItem.defaultProps = {
    user_profile: "",
    nick: "aaa",
    user_id: "",
    post_id: 1,
    contents: "bbb",
    insert_dt: "2021-01-01 19:00:00"
}