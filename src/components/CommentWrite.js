import React, { useState } from "react";
import { Grid, Input, Button } from "../elements";

import { actionCreators as commentActions } from "../redux/modules/comment";
import { useDispatch, useSelector } from "react-redux";

const CommentWrite = (props) => {
    const dispatch = useDispatch();
    const [comment_text, setCommentText] = useState();

    const {post_id} = props;
    const onChange = (e) => {
        setCommentText(e.target.value);
    }

    const write = () => {
        dispatch(commentActions.addCommentFB(post_id, comment_text))
        //아래 인풋창에 텍스트 남아있지 않도록 날리기 위해서 빈값으로 셋커멘트텍스트함.
        setCommentText("");
    }

    return (
        <React.Fragment>
            <Grid padding="16px" is_flex>
                {/* 여기서 밸류를 넣어주는 이유는, 실제로 인풋창에서 텍스트 입력 후 작성버튼을 눌렀을때 작성된 텍스트가 인풋창에 남아있지 않도록 날려버리기 위함 */}
                <Input 
                placeholder="댓글내용을 입력해 주세요" 
                _onChange={onChange} 
                value={comment_text}
                onSubmit={write} 
                is_submit/>
                <Button width="50px" margin="0px 2px 0px 2px"
                _onClick={write}
                >작성</Button>
            </Grid>
        </React.Fragment>
    )
}

export default CommentWrite;