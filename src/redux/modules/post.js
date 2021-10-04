import { createAction, handleActions } from "redux-actions";
import produce, { produde } from "immer";
import { deleteCookie } from "../../shared/Cookie";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";

import { actionCreators as imageActions } from "./image";



const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";

const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));



const initialState = {
    list: [],
}

const initialPost = {
    // id: 0,
    // user_info: {
    //     nick: "young",
    //     user_profile: "https://imymemine-dictionary.s3.ap-northeast-2.amazonaws.com/huff.jpeg",
    // },
    image_url: "https://imymemine-dictionary.s3.ap-northeast-2.amazonaws.com/huff.jpeg",
    contents: "",
    comment_cnt: 0,
    //지금 오늘 날짜를 문자열로 나오게 함
    insert_dt: moment().format("YYYY-MM-DD hh:mm:ss")
    // insert_dt: "2021-09-30 10:00:00",
}


const addPostFB = (contents = "",) => {
    return function (dispatch, getState, { history }) {
        const postDB = firestore.collection("post");

        const _user = getState().user.user;

        const user_info = {
            nick: _user.nick,
            user_id: _user.uid,
            user_profile: _user.user_profile,
        }
        const _post = {
            ...initialPost,
            contents: contents,
            insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
        };

        //스토어에 있는 정보 접근 가능하게 하는 겟스테이트로 상태값 가져옴
        const _image = getState().image.preview;

        console.log(_image);
        //typeof로 이미지가 스트링 구조인것을 확인하고 밑에서 putString을 쓴다.
        console.log(typeof _image);

        //사용자의 uid와 시간으로 업로드 하면 파일명이 중복되는 일을 방지할 수 있다.
        const _upload = storage.ref(`images/${user_info.user_id}_${new Date().getTime()}`).putString(_image, "data_url")

        //스냅샷으로 올린 이미지의 url을 확인
        _upload.then(snapshop => {
            snapshop.ref.getDownloadURL().then(url => {
                console.log(url);

                return url;
            }).then(url => {
                postDB
                    .add({ ...user_info, ..._post, image_url: url })
                    .then((doc) => {
                        //리덕스에 들어가는 데이터와 파이어베이스의 데이터 모양이 다르기때문에 모양새 맞춰주는게 필수다
                        let post = { user_info, ..._post, id: doc.id, image_url: url };
                        dispatch(addPost(post));
                        history.replace("/");

                        dispatch(imageActions.setPreview(null));
                    })
                    .catch((error) => {
                        window.alert("포스트 작성 실패");
                        console.log("post 작성 실패", error);
                    });
            }).catch((error) => {
                window.alert("이미지 업로드 실패실패");
                console.log("이미지 업로드 실패", error);
            })
        });
    }
}


const getPostFB = () => {
    return function (dispatch, getState, { history }) {
        const postDB = firestore.collection("post");


        postDB.get().then((docs) => {
            let post_list = [];
            docs.forEach((doc) => {
                let _post = doc.data();

                // ['comment_cnt', 'contents' ... ] 등의 형식으로 배열로 만들어준다.
                let post = Object.keys(_post).reduce((acc, cur) => {

                    if (cur.indexOf("user_") !== -1) {
                        return {
                            ...acc, user_info: { ...acc.user_info, [cur]: _post[cur] }
                        };
                    }
                    return { ...acc, [cur]: _post[cur] };
                }, { id: doc.id, user_info: {} }
                );

                post_list.push(post);

                //위 코드와 같은 내용
                // let _post = {
                //     id: doc.id,
                //     ...doc.data()
                // };

                // let post = {
                //     id: doc.id,
                //     user_info: {
                //         nick: _post.nick,
                //         user_profile: _post.user_profile,
                //         user_id: _post.user_id,
                //     },
                //     image_url: _post.image_url,
                //     contents: _post.contents,
                //     comment_cnt: _post.comment_cnt,
                //     insert_dt: _post.insert_dt,
                // };

                // post_list.push(post);
            })

            console.log(post_list);

            dispatch(setPost(post_list));
        })
    }
}



export default handleActions(
    {
        [SET_POST]: (state, action) => produce(state, (draft) => {
            draft.list = action.payload.post_list;
        }),

        [ADD_POST]: (state, action) => produce(state, (draft) => {
            //배열의 맨 앞에 붙어야 하기때문에 unshift를 쓴다, push를 사용할 경우 가장 뒤에 붙는다.
            //원래 unshift를 쓸때는 불변성 고려를 해야하지만 immer로 불변성에 대한 리스크헤징이 되어있는 상태로 판단하고 진행.
            draft.list.unshift(action.payload.post);
        }),
    }, initialState
);

const actionCreators = {
    setPost,
    addPost,
    getPostFB,
    addPostFB,
}

export { actionCreators };