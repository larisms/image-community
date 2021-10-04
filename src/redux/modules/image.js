import { createAction, handleActions } from "redux-actions";
import produce from "immer";

import { storage } from "../../shared/firebase";

const UPLOADING = "UPLOADING";
const UPLOAD_IMAGE = "UPLOAD_IMAGE";
const SET_PREVIEW = "SET_PREVIEW";

const uploading = createAction(UPLOADING, (uploading) => ({uploading}));
const uploadImage = createAction(UPLOAD_IMAGE, (image_url) => ({image_url}));
const setPreview = createAction(SET_PREVIEW, (preview) => ({preview}));


const initialState = {
    image_url: '',
    uploading: false,
    preview: null,
}

const uploadImageFB = (image) => {
    return function(dispatch, getState, {history}){
        
        dispatch(uploading(true));

        const _upload = storage.ref(`images/${image.name}`).put(image);

        _upload.then((snapshot) => {
            console.log(snapshot);
            // dispatch(uploading(false)); 리듀서에 넣었기 때문에 두번할 필요없음.
            snapshot.ref.getDownloadURL().then((url) => {
                
                dispatch(uploadImage(url));
                console.log(url);
            })
        })
    }
}

export default handleActions({
    [UPLOAD_IMAGE]: (state, action) => produce(state, (draft) => {
        draft.image_url = action.payload.image_url;
        draft.uploading = false;
    }),

    [UPLOADING]: (state, action) => produce(state, (draft) => {
        draft.uploading = action.payload.uploading;
    }),

    [SET_PREVIEW]: (state, action) => produce(state, (draft) => {
        draft.preview = action.payload.preview;
    }),
}, initialState);

//업로딩은 밖에서 조정하는게 아니다, 업로드 시작할때, 이 모듈 안에서만 실행되면 되기 때문에 굳이 밖에서 쓸 수있게 하지 않는다
const actionCreators = {
    uploadImage,
    uploadImageFB,
    setPreview,
}

export {actionCreators};