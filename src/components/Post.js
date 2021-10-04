import React from "react";
// import Grid from "../elements/Grid";
// import Image from "../elements/Image";
// import Text from "../elements/Text";

import { Grid, Image, Text, Button } from "../elements/index"
import { history } from "../redux/configureStore";

const Post = (props) => {
    console.log("aaa", props.id)
    return (
        <React.Fragment>
            <Grid>
                <Grid is_flex padding="16px">
                    <Grid is_flex width="auto">
                        <Image shape="circle" src={props.src} />
                        <Text bold>{props.user_info.nick} </Text>
                    </Grid>
                    <Grid is_flex width="auto">
                        <Text>{props.insert_dt}</Text>
                        {/* 프롭스에 is_me가 있는 경우에만 버튼을 보여준다 */}
                        {props.is_me && <Button width="auto" margin="4px" padding="4px" _onClick={() => {
                            history.push(`/write/${props.id}`);
                        }}>crystal</Button>}
                    </Grid>
                </Grid>
                <Grid padding="16px">
                    <Text>{props.contents}</Text>
                </Grid>
                <Grid>
                    <Image shape="rectangle" src={props.image_url} />
                </Grid>
                <Grid padding="16px">
                    <Text margin="0px" bold>댓글{props.comment_cnt}개</Text>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

//기본적으로 필요한 프롭스들을 미리 넘겨놓기, 프롭스가 없어서 오류가 난다거나 화면이 깨지는 상황은 없음. (다만 잘못가져오는것에 대한 방어가 약함)
Post.defaultProps = {
    user_info: {
        nick: "young",
        user_profile: "https://imymemine-dictionary.s3.ap-northeast-2.amazonaws.com/huff.jpeg",
    },
    image_url: "https://imymemine-dictionary.s3.ap-northeast-2.amazonaws.com/huff.jpeg",
    contents: "hufflepuff",
    comment_cnt: 10,
    insert_dt: "2021-09-30 10:00:00",
    is_me: false,
};

export default Post;