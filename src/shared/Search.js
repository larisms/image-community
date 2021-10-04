import React from "react";
//언더바에 debounce 와 throttle 이 들어있음.
import _ from "lodash";

const Search = () => {

    const [text, setText] = React.useState("")

    const debounce = _.debounce((e) => {
        //뭘할거고, 몇초동안 시간을 정해줄것이냐
        console.log("debounce :::", e.target.value);
    }, 1000)


    const throttle = _.throttle((e) => {
        //뭘할거고, 몇초동안 시간을 정해줄것이냐
        console.log("throttle :::", e.target.value)
    }, 1000)

    
    //[]안의 어떤것이 변할때만, 이 함수를 초기화 한다
    const keyPress = React.useCallback(debounce, [text])
    // const debounce = _.debounce((value) => {console.log(value);}, 1000)
    
    const onChange = (e) => {
        debounce(e);
    }

    

    return (
        <div>
            <input type="text" onChange={onChange} />
        </div>
    )
}

export default Search;