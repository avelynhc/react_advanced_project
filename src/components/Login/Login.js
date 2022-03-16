import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

// use useReducer when using useState() becomes cumbersome
// great if you need more power(complex logic)
// if you have related piecs of state/data
// makes sure you get the latest info
const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };// access the last value for the latest entered email
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'PASSWORD') {
    return {value: action.val, isValid: action.val.trim().length > 6}
  } else if (action.type === 'PW_BLUR') {
    return {value: state.value, isValid: state.value.trim().length > 6}
  }

  return {value: "", isValid: false};
}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null
  });

  useEffect(() => {
    console.log("effect runnning");
    return () => {
      console.log("effect cleanup");
    };
  }, [emailState.value]); // only runs when second parameter is reevaluated

  // alias assignment
  // objecet destructuring
  // this ensures that useEffect won't rerun if entered info already is valid
  const {isValid: emailIsValid} = emailState;
  const {isValid: passwordIsValid} = passwordState;

  // useEffect is for handling side effect: http request, user input. should be excueted in response to some other action(email address updated)
  useEffect(() => {
    // this function will only be executed only if either value in setFormIsValid, enteredEmail, enteredPassword changes
    console.log("checking form validity!");
    // debouncing - instead of rendering setFormIsValid function on every input, set timeout
    // after 500ms, we validate user input
    const identifier = setTimeout(() => {
      setFormIsValid(
        emailIsValid && passwordIsValid// update stae based on other state
      );
    }, 500);

    // clean up function it runs before userEffect is executed next time. it also runs whenver component is reused
    return () => {
      console.log("clean up!");
      clearTimeout(identifier); // clear the timer that was set before
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    dispatchEmail({type: 'USER_INPUT', val: event.target.value});

    // setFormIsValid(
    //   event.target.value.includes('@') && passwordState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({type: 'PASSWORD', val: event.target.value})

    setFormIsValid(
      emailState.isValid && event.target.value.trim().length > 6
    );
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.isValid);
    dispatchEmail({type: 'INPUT_BLUR'});
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPassword({type: 'PW_BLUR'});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
