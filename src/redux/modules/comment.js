import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, realtime } from "../../shared/firebase";
import "moment";
import moment from "moment";

import firebase from "@firebase/app-compat";

import { actionCreators as postActions } from "./post";


const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";

const LOADING = "LOADING";

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({ post_id, comment_list }));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({ post_id, comment }));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
    list: {},
    is_loading: false,
};

const addCommentFB = (post_id, contents) => {
    return function (dispatch, getState, { history }) {
        const commentDB = firestore.collection("comment");
        const user_info = getState().user.user;

        let comment = {
            post_id: post_id,
            user_id: user_info.uid,
            user_nick: user_info.user_nick,
            user_profile: user_info.user_profile,
            contents: contents,
            insert_dt: moment().format("YYYY-MM-DD hh:mm:ss")
        }

        commentDB
            .add(comment)
            .then((doc) => {
                const postDB = firestore.collection("post");

                const post = getState().post.list.find(l => l.id === post_id);

                //인크리먼트에 들어가있는 숫자만큼 현재 값에서 추가해주는 기능. 파이어베이스가 제공하는 기능.
                const increment = firebase.firestore.FieldValue.increment(1);
                comment = { ...comment, id: doc.id };
                //comment_cnt + 1 하는 것과 같음.
                postDB
                    .doc(post_id)
                    .update({ comment_cnt: increment })
                    .then((_post) => {

                        dispatch(addComment(post_id, comment));

                        if (post) {
                            dispatch(postActions.editPost(post_id, {
                                comment_cnt: parseInt(post.comment_cnt) + 1,
                            }));
                            const _noti_item = realtime.ref(`noti/${post.user_info.user_id}/list`).push();

                            _noti_item.set({
                                post_id: post.id,
                                user_nick: comment.user_nick,
                                image_url: post.image_url,
                                isert_dt: comment.insert_dt,
                            }, (err) => {
                                if(err){
                                    console.log("알림 저장 실패")
                                }else{
                                    const notiDB = realtime.ref(`noti/${post.user_info.user_id}`);

                                    notiDB.update({read: false});
                                }
                            });
                            // notiDB.update({read: false});

                        }
                    })
            })
    }
}

//다시 봐야함.
const getCommentFB = (post_id = null) => {
    return function (dispatch, getState, { history }) {
        if (!post_id) {
            return;
        }
        const commnetDB = firestore.collection("comment");

        commnetDB
            .where("post_id", "==", post_id)
            .orderBy("insert_dt", "desc")
            .get()
            .then((docs) => {
                let list = [];

                docs.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id });
                })

                dispatch(setComment(post_id, list));
            }).catch(error => {
                console.log("댓글정보를 가져올수 없습니다", error)
            })
    }
}


export default handleActions(
    {
        [SET_COMMENT]: (state, action) => produce(state, (draft) => {
            //댓글이 들어갈만한 빈방을 만들어서 그 방에 각각 게시글에 맞는 댓글 리스트를 저장하기 위해서. 빈방은 딕셔너리 형태로.
            //let data = {[post_id]: com_list, ...}이런형식으로.
            //포스트 아이디 하나에 저장해 둔것이기 때문에 다음번에 게시물에 들어갔을때 이 아이디 값만 확인하면 댓글을 불러올수 있음.
            draft.list[action.payload.post_id] = action.payload.comment_list;
        }),
        [ADD_COMMENT]: (state, action) => produce(state, (draft) => {
            draft.list[action.payload.post_id].unshift(action.payload.comment);
        }),
        [LOADING]: (state, action) =>
            produce(state, (draft) => {
                draft.is_loading = action.payload.is_loading;
            })
    },
    initialState
);

const actionCreators = {
    getCommentFB,
    addCommentFB,
    setComment,
    addComment,
};

export { actionCreators };