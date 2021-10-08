import React from "react";
import styled from "styled-components";

const Button = (props) => {
    
    const {text, _onClick, is_float, children, margin, width, padding, border} = props;

    if (is_float) {
        return (
            <React.Fragment>
                <FloatButton onClick={_onClick}>{text? text : children}</FloatButton>
            </React.Fragment>
        );
    }

    const styles = {
        margin: margin,
        width: width,
        padding: padding,
        border: border,
        
    }

    return (
        <React.Fragment>
            <ElButton {...styles} onClick={_onClick}>{text? text : children}</ElButton>
        </React.Fragment>
    )
}

Button.defaultProps = {
    text: false,
    children: null,
    _onClick: () => {},
    is_float: false,
    margin: false,
    width: '100%',
    padding: "12px 0px",
    border: "none",
};

const ElButton = styled.button`
    width: ${(props) => props.width};
    background-color: #ffffff;
    color: #212121;
    padding: ${(props) => props.padding};
    box-sizing: boder-box;
    border: ${(props) => props.border};
    ${(props) => (props.margin? `margin: ${props.margin};` : '')};
`;

const FloatButton = styled.button`
    width: 50px;
    height: 50px;
    background-color:#212121;
    color: #ffffff;
    box-sizing: border-box;
    font-size: 36px;
    font-weight: 800;
    position: fixed;
    bottom: 50px;
    right: 16px;
    text-align: center;
    vertical-align: middle;
    border: 1px solid white;
    border-radius: 50px;
`;

export default Button;