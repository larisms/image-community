import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { Grid, Text, Image } from "../elements"

import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";

const Notification = (props) => {
    const user = useSelector(state => state.user.user);
    const [noti, setNoti] = useState([]);
    useEffect(() => {
        if(!user){
            return;
        }
        // 이 안에 있는 리스트에서 정보를 가지고 온다? /list
        const notiDB = realtime.ref(`noti/${user.uid}/list`)

        const _noti = notiDB.orderByChild("insert_dt");

        _noti.once("value", snapshot => {
            if(snapshot.exists()){
                let _data = snapshot.val();

                let _noti_list = Object.keys(_data).reverse().map(s => {
                    return _data[s];
                })
                console.log(_noti_list);
                setNoti(_noti_list)
            }
        })
    }, [user]);
    
    return (
        <React.Fragment>
            <Grid padding="16px" bg="#EFF6FF">
                {noti.map((n, idx) => {
                    return (
                        <Card key={`noti_${idx}`} {...n} />
                    )
                })}
            </Grid>
        </React.Fragment>
    )
}

export default Notification;