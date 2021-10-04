import React, {useEffect, useState} from "react";
import { Grid, Button, Text, Image, Input } from "../elements";
import Upload from "../shared/Upload";

import { useSelector, useDispatch } from "react-redux";
import post, { actionCreators as postActions } from "../redux/modules/post";
import { setCookie } from "../shared/Cookie";
import { actionCreators as imageActions } from "../redux/modules/image";


const PostWrite = (props) => {
    const dispatch = useDispatch();
    const is_login = useSelector((state) => state.user.is_login);
    const preview = useSelector((state) => state.image.preview);
    const post_list = useSelector((state) => state.post.list);

    console.log("paramsid", props.match.params.id);
 
    const post_id = props.match.params.id;
    const is_edit = post_id? true : false;

    const {history} = props;

    let _post = is_edit? post_list.find((p) => p.id === post_id) : null;

    console.log(_post);
    const [contents, setContents] = useState(_post? _post.contents : "");

    useEffect(() => {
        if(is_edit && !_post){
            console.log('no post');
            history.goBack();

            return;
        }

        if(is_edit){
            dispatch(imageActions.setPreview(_post.image_url));
        }
    },[]);

    const chagngeContents = (e) => {
        setContents(e.target.value);
    }

    const addPost = () => {
        dispatch(postActions.addPostFB(contents));
    }

    const editPost = () => {
        dispatch(postActions.editPostFB(post_id, {contents: contents}));
    }

    if (!is_login){
        return (
            <Grid margin="100px 0px" padding="16px" center>
                <Text size="32px" bold>잠깐</Text>
                <Text size="16px">로그인 후에만 글을 쓸 수 있어요!</Text>
                <Button _onClick={() => {history.replace("/");}}>로그인하러 가기</Button>
            </Grid>
        )
    }

    return (
        <React.Fragment>
            <Grid padding="16px">
                <Text margin="0px" size="36px" bold>{is_edit? "게시글 수정" : "게시글 작성"}</Text>
                <Upload></Upload>
            </Grid>
            <Grid>
                <Grid padding="16px">
                    <Text margin="0px" size="24px" bold>미리보기</Text>
                </Grid>

                <Image shape="rectangle" src={preview? preview: "https://imymemine-dictionary.s3.ap-northeast-2.amazonaws.com/black.jpeg"}/>
            </Grid>
            <Grid padding="16px">
                <Input value={contents} _onChange={chagngeContents} label="게시글 내용" placeholder="게시글 작성" multiLine/>
            </Grid>
            <Grid padding="16px">
                {is_edit? (
                    <Button text="게시글 수정" _onClick = {editPost}></Button>
                ) : (
                    <Button text="게시글 작성" _onClick = {addPost}></Button>
                )}
                
            </Grid>
        </React.Fragment>
    )
}

export default PostWrite;