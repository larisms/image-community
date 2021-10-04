const getCookie = (name) => {
    let value = document.cookie;

    let parts = value.split(`; ${name}=`); 

    if(parts.length === 2){ //pop은 가장 뒤에 있는 부분을 잘라내기 해오는 것, shift는 반대로 가장 앞부분
        return parts.pop().split(";").shift();

    }
}

const setCookie = (name, value, exp = 5) => {

    let date = new Date();
    date.setTime(date.getTime() + exp*24*60*60*1000);

    document.cookie = `${name}=${value}; expires=${date.toUTCString()}`;
};

const deleteCookie = (name) => {
    let date = new Date().toUTCString();

    document.cookie = name+"=; expires="+date;
}
export {getCookie, setCookie, deleteCookie};