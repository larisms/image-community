import { createAction, handleActions } from "redux-actions";
import produce, { produde } from "immer";
import { deleteCookie } from "../../shared/Cookie";
import { firestore, storage } from "../../shared/firebase";
import {doc, deleteDoc} from "firebase/firestore";
import "moment";
import moment from "moment";

import { actionCreators as imageActions } from "./image";



const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const DELETE_POST = "DELETE_POST";
const LOADING = "LOADING";

const setPost = createAction(SET_POST, (post_list, paging) => ({ post_list, paging }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({ post_id, post }));
const deletePost = createAction(DELETE_POST, (post_id) => ({post_id}))
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));


const initialState = {
    list: [],
    paging: { start: null, next: null, size: 3 },
    is_loading: false,
}

const initialPost = {
    // id: 0,
    // user_info: {
    //     user_nick: "young",
    //     user_profile: "https://imymemine-dictionary.s3.ap-northeast-2.amazonaws.com/huff.jpeg",
    // },
    image_url: "https://imymemine-dictionary.s3.ap-northeast-2.amazonaws.com/huff.jpeg",
    contents: "",
    comment_cnt: 0,
    //지금 오늘 날짜를 문자열로 나오게 함
    insert_dt: moment().format("YYYY-MM-DD hh:mm:ss")
    // insert_dt: "2021-09-30 10:00:00",
}

const editPostFB = (post_id = null, post = {}) => {
    return function (dispatch, getState, { history }) {

        if (!post_id) {
            console.log('게시물정보가 없습니다');
            return;
        }
        const _image = getState().image.preview;

        const _post_idx = getState().post.list.findIndex(p => p.id === post_id);
        const _post = getState().post.list[_post_idx];

        console.log(_post)

        const postDB = firestore.collection("post");

        if (_image === _post.image_url) {
            postDB.doc(post_id).update(post).then(doc => {
                dispatch(editPost(post_id, { ...post }));
                history.replace("/");
            });

            return;
        } else {
            const user_id = getState().user.user.uid;
            const _upload = storage
                .ref(`images/${user_id}_${new Date().getTime()}`).putString(_image, "data_url")

            //스냅샷으로 올린 이미지의 url을 확인
            _upload.then(snapshop => {
                snapshop.ref.getDownloadURL().then(url => {
                    console.log(url);

                    return url;
                }).then(url => {
                    postDB
                        .doc(post_id)
                        .update({ ...post, image_url: url })
                        .then(doc => {
                            dispatch(editPost(post_id, { ...post, image_url: url }));
                            history.replace("/");
                        });


                }).catch((error) => {
                    window.alert("이미지 업로드 실패실패");
                    console.log("이미지 업로드 실패", error);
                })
            });
        }
    }
}


const addPostFB = (contents = "",) => {
    return function (dispatch, getState, { history }) {
        const postDB = firestore.collection("post");

        const _user = getState().user.user;

        const user_info = {
            user_nick: _user.user_nick,
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


const getPostFB = (start = null, size = 3) => {
    return function (dispatch, getState, { history }) {

        let _paging = getState().post.paging;

        if(_paging.start && !_paging.next){
            return;
        }

        dispatch(loading(true));
        const postDB = firestore.collection("post");

        // 이니셜에서 설정한 갯수는 3개이기 때문에 다음것까지 계산해서 4개를 가지고 오게 설정한다. 그리고 리덕스에는 3개만 가지고 오게 한다.
        let query = postDB.orderBy("insert_dt", "desc");

        if (start) {
            query = query.startAt(start)
        }

        query
            .limit(size + 1)
            .get()
            .then(docs => {
                let post_list = [];

                let paging = {
                    start: docs.docs[0],
                    // +1 이 다음것까지 계산한것이기 때문에, +1이 맞으면 다음 페이지가 있다는 것. 
                    next: docs.docs.length === size + 1 ? docs.docs[docs.docs.length - 1] : null,
                    size: size,
                }

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
                    //         user_nick: _post.user_nick,
                    //         user_profile: _post.user_profile,
                    //         user_id: _post.user_id,
                    //     },
                    //     image_url: _post.image_url,
                    //     contents: _post.contents,
                    //     comment_cnt: _post.comment_cnt,
                    //     insert_dt: _post.insert_dt,
                    // };

                    // post_list.push(post);
                });
                // 그냥 포스트 리스트를 푸시하면 불러온 4개가 들어가기 때문에 팝으로 마지막 1개를 빼준다.
                post_list.pop();

                dispatch(setPost(post_list, paging));
            });

        return;
        postDB.get().then((docs) => {
            let post_list = [];
            docs.forEach((doc) => {
                let _post = doc.data();
                console.log("postpost", _post)

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
                //         user_nick: _post.user_nick,
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
};

export const deletePostFB = (post_id) => {
    // return function (dispatch, getState, {history}) {
    //     const postDB = firestore.collection("post");

    //     if(!post_id){
    //         window.alert("삭제할 수 없는 게시글입니다")
    //         return;
    //     }
    //     postDB
    //     .doc(post_id)
    //     .delete()
    //     .then((doc) => {
    //         dispatch(deletePost(post_id));
    //         history.replace("/")
    //     })
    //     .catch((err) => {
    //         console.log("삭제실패",err);
    //     })
    // }


    return async function(dispatch, getState, {history}){
        const docRef = await doc(firestore, "post", post_id);
        console.log("docRef", docRef)
        await deleteDoc(docRef);

        dispatch(deletePost(post_id));
        window.alert("삭제되었습니다");
        history.replace("/");

        // const postDB = firestore.collection("post");
        // console.log("delete", postDB)
        // postDB
        // .doc(d_id).get().delete().then(doc => {
        //     console.log("doc", doc);
        //     console.log("docid", doc.id);
            
        //     dispatch(deletePost(d_id));
        // })
    }
}


const getOnePostFB = (id) => {
    return function(dispatch, getState, {history}){

        const postDB = firestore.collection("post");
        postDB.doc(id).get().then(doc => {
            console.log(doc);
            console.log(doc.data());

            let _post = doc.data();
            let post = Object.keys(_post).reduce(
                (acc, cur) => {
                    if (cur.indexOf("user_") !== -1) {
                        return {
                            ...acc, user_info: { ...acc.user_info, [cur]: _post[cur] }
                        };
                    }
                    return { ...acc, [cur]: _post[cur] };
                }, { id: doc.id, user_info: {} }
            );

            dispatch(setPost([post]));
        });
    }
}


export default handleActions(
    {
        [SET_POST]: (state, action) => produce(state, (draft) => {            
            // draft.list = action.payload.post_list; 이렇게 쓰면 포스트 리스트를 아예 대치를 한다.
            draft.list.push(...action.payload.post_list);
            //리스트의 중복 값 제거 acc 는 누산된 값, cur 은 당시현재값
            draft.list = draft.list.reduce((acc, cur) => {
                if(acc.findIndex(a => a.id === cur.id) === -1){
                    return [...acc, cur];
                }else{
                    acc[acc.findIndex(a => a.id === cur.id)] = cur;
                    return acc
                }
            }, []);

            if(action.payload.paging){
                draft.paging = action.payload.paging;
            }
            
            //다 불러왔으면 끝나는 것이기 때문에 이즈로딩은 펄스로.
            draft.is_loading = false;
        }),

        [ADD_POST]: (state, action) => produce(state, (draft) => {
            //배열의 맨 앞에 붙어야 하기때문에 unshift를 쓴다, push를 사용할 경우 가장 뒤에 붙는다.
            //원래 unshift를 쓸때는 불변성 고려를 해야하지만 immer로 불변성에 대한 리스크헤징이 되어있는 상태로 판단하고 진행.
            draft.list.unshift(action.payload.post);
        }),

        [EDIT_POST]: (state, action) => produce(state, (draft) => {
            // 맞는 조건의 인덱스 번호를 주는 findIndex
            let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
            //여기서 스프레드를 쓴 이유, if 문으로 이미지가 있냐없냐 를 판별하는것 보다 이게 간편함
            draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
        }),

        [DELETE_POST]: (state, action) => produce(state, (draft) => {
            let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

            if (idx !== -1) {
                draft.list.splice(idx, 1);
            }
            // draft.list.filter((d_id) => {
            //     let p_id = action.payload.post_id;
            //     return p_id !== d_id;
            // });
            
        }),

        [LOADING]: (state, action) => produce(state, (draft) => {
            draft.is_loading = action.payload.is_loading;
        }),
    }, initialState
);

const actionCreators = {
    setPost,
    addPost,
    editPost,
    getPostFB,
    addPostFB,
    editPostFB,
    deletePostFB,
    getOnePostFB,
}

export { actionCreators };