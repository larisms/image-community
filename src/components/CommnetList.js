import React from "react";
import { Grid, Image, Text } from "../elements";

const CommentList = (props) => {
    return (
        <React.Fragment>
            <Grid padding="16px">
                <CommentItem></CommentItem>
                <CommentItem></CommentItem>
                <CommentItem></CommentItem>
                <CommentItem></CommentItem>
                <CommentItem></CommentItem>
                <CommentItem></CommentItem>
            </Grid>
        </React.Fragment>
    )
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