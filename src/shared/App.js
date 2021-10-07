import './App.css';
import React, { useEffect } from "react";

import { BrowserRouter, Route } from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../redux/configureStore';

import PostList from '../pages/PostList';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import PostWrite from '../pages/PostWrite';
import PostDetail from '../pages/PostDetail';
import Search from './Search';
import Notification from '../pages/Notification';

import Header from '../components/Header';
import { Grid, Button } from '../elements';
import Permit from './Permit';

import { useDispatch } from 'react-redux';
import { actionCreators as userActions } from "../redux/modules/user";

import {apiKey} from './firebase';


function App() {
  const dispatch = useDispatch();

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  useEffect(() => {

    if(is_session) {
      dispatch(userActions.loginCheckFB());
    }
  }, [])

  return (
    <React.Fragment>
      <Grid>
        <Header></Header>
        {/* 원래 브라우저라우터가 각각의 컴포넌트들에게 히스토리 속성을 넣어주고 있었던 것을, 새로 만든 히스토리를 쓰기 위해 커넥티드 라우터로 변경. */}
        {/* <BrowserRouter> */}
        <ConnectedRouter history={history}>
          <Route path="/" exact component={PostList} />
          <Route path="/Login" exact component={Login} />
          <Route path="/Signup" exact component={Signup} />
          <Route path="/write" exact component={PostWrite}/>
          <Route path="/write/:id" exact component={PostWrite}/>
          <Route path="/post/:id" exact component={PostDetail}/>
          <Route path="/search" exact component={Search} /> 
          <Route path="/noti" exact component={Notification} />
        </ConnectedRouter>
        {/* </BrowserRouter> */}
      </Grid>
      <Permit>
        <Button is_float text="+" _onClick={() => {history.push("/write")}}></Button>
      </Permit>
    </React.Fragment>
  )
}

export default App;
