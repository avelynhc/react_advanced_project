import React from "react";
import { useRef, useImperativeHandle } from "react";

import classes from "../Input/Input.module.css";

//forwarRef: returns react component that is capable of being wrapped
const Input = React.forwardRef((props, ref) => {
  const inputRef = useRef();

  const activate = () => {
      inputRef.current.focus();
  }
  // you can expose functionality from react component to parent component through refs and
  useImperativeHandle(ref, () => {
      return {// exposing focus function
          focus: activate // translation object btw internal and outside world
      };
  });

//   useEffect(() => {
//       inputRef.current.focus();// connect the ref to the input
//   }, []); // this only runs after entire component is executed for the first time

  return (
    <div
      className={`${classes.control} ${
        props.isValid === false ? classes.invalid : ""
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
});

export default Input;
