import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import CommentList from "../components/CommnetList";
import CommentWrite from "../components/CommentWrite";

import Permit from "../shared/Permit";

import { useSelector, useDispatch } from "react-redux";

import { actionCreators as postActions } from "../redux/modules/post";

import { firestore } from "../shared/firebase";

const PostDetail = (props) => {
    const id = props.match.params.id;
    const dispatch = useDispatch();

    console.log(id);

    const user_info = useSelector((state) => state.user.user);
    const post_list = useSelector(store => store.post.list);
    const post_idx = post_list.findIndex(p => p.id === id);
    //원래 post_data 에서 post 로 바꿈.
    const post = post_list[post_idx];

    //리덕스에 넣어서 가져와도 되지만, 단일 데이터는 스테이트로 할 수 있다는 예시 
    //파이어 스토어에서 데이터 하나만 가지고 와서 관리하는 부분.
    //리덕스로 보낸다면? 어떻게? 이부분 공부 필요해 보임.. 어떤 차이인지 개념 명확히 잡을것.
    //아래 getOnePostFB 로 보내면서 필요없어진 부분.
    // const [post, setPost] = useState(post_data? post_data : null);

    useEffect(() => {

        //포스트 데이터를 이미 갖고 있으면, 밑에 있는 코드를 실행시킬 필요가 없기 때문에 if문 활용.
        if (post) {
            return;
        }

        dispatch(postActions.getOnePostFB(id));

        // getOnePostFB 로 보내고 필요없어진 부분.
        // const postDB = firestore.collection("post");
        // postDB.doc(id).get().then(doc => {
        //     console.log(doc);
        //     console.log(doc.data());

        //     let _post = doc.data();
        //     let post = Object.keys(_post).reduce(
        //         (acc, cur) => {
        //             if (cur.indexOf("user_") !== -1) {
        //                 return {
        //                     ...acc, user_info: { ...acc.user_info, [cur]: _post[cur] }
        //                 };
        //             }
        //             return { ...acc, [cur]: _post[cur] };
        //         }, { id: doc.id, user_info: {} }
        //     );

        //     setPost(post);
        // })

    }, [])

    console.log(post);


    return (
        <React.Fragment>
            {/* 게시물 디테일 페이지의 주소(아이디값)가 잘못되었을때 오류가 뜨는걸 방지? */}
            {/* ?. 옵셔널체이닝 부분 -> 이렇게 해두면 유저인포가 있을때만 uid 를 불러온다. 즉 로그인 하지 않아서 유저인포가 없을때 요청을 넣고 오류가 생기는 상황방지 */}
            {post && <Post {...post} is_me={post.user_info.user_id === user_info?.uid} />}
            <Permit>
                <CommentWrite post_id={id} />
            </Permit>
            <CommentList post_id={id} />
        </React.Fragment>
    )
}

export default PostDetail;