import React, { useCallback, useEffect } from "react";
import _ from "lodash";
import { Spinner } from "../elements";

const InfinityScroll = (props) => {

    const { children, callNext, is_next, loading } = props;

    const _handleScroll = _.throttle(() => {

        //로딩 중이면 콜넥스트를 다시 불러오지 않도록.
        if (loading) {
            return;
        };

        const {innerHeight} = window;
        const {scrollHeight} = document.body;
        //도큐먼트 안이 도큐먼트 엘리먼트가 있는지, 있으면 스크롤 탑을 가지고 온다 아니면 도큐먼트에 바디에 스크롤탑을 가져온다.
        //브라우저마다 도큐먼트에 접근해서 스크롤탑을 가져오는게 다르기 때문에 호환성을 맞춰주기 위해 쓰는 방법
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop


        if(scrollHeight - innerHeight - scrollTop < 200) {
            callNext();
        }
    }, 300);

    //메모리제이션 되어 있고, 위의 로딩값은 고정이 되어있다. 리덕스에서 바뀌었을떄, 어떻게 메모리된 함수를 바꿔줄 수 있을까? [] 배열에 넘겨주면 된다? 
    const handleScroll = useCallback(_handleScroll, [loading]);

    //로딩했을때, 이벤트를 달아주는 것 먼저.
    useEffect(() => {
        //만약에 로딩중이면 리턴해버린다.
        if (loading) {
            return;
        };
        //is_next를 넣어서 is_next가 있을때 유즈이펙트 실행, 다음이 있는지 확인하고, 만약에 없으면 굳이 이벤트를 구독할 필요가 없기 때문에 if문으로 설정해준다.
        if (is_next) {
            //scroll이벤트를 구독하도록 만들어주고 함수를 실행하도록 설정.
            window.addEventListener("scroll", handleScroll);
        } else {
            window.removeEventListener("scroll", handleScroll);
        }

        //클래스형에서는 언마운트로 구독해제를 하지만, 함수형에서는 리턴으로 넘긴다. 클린업한다 라고 한다. 이 함수형 컴포넌트가 화면에서 사라질때 실행. 언마운트와 비슷.
        return () => window.removeEventListener("scroll", handleScroll);
    }, [is_next, loading])

    return (
        <React.Fragment>
            {/* 인피니티스크롤 컴포넌트로 포스트리스트 컴포넌트를 감싸줬기때문에, 아래에 프롭스.칠드런으로 내보내줘야함 */}
            {props.children}
            {is_next && (<Spinner/>)}
        </React.Fragment>
    )
}

//꼭 있어야 하는것이기 때문에 디폴트를 준다.
InfinityScroll.defaultProps = {
    children: null,
    //다음목록을 불러올 수 있는 함수를 실행해주기 위함.
    callNext: () => { },
    //다음 목록이 있는지 없는지를 알기 위함.
    is_next: false,
    //스크롤 내리다가 다음 목록을 부르는 도중에 또 다음목록을 부르도록(중복) 실행하는것을 방지하기 위함.
    loading: false,
}

export default InfinityScroll;