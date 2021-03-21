import axios from "axios";
import { REGISTER_USER, GET_ERRORS, SET_CURRENT_USER } from "./types";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

// REGISTER USER
export const registerUser = (newUser, history) => (dispatch) => {
  axios
    .post("/api/users/register", newUser)
    .then((res) => history.push("/login"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );

  return {
    type: REGISTER_USER,
    payload: newUser,
  };
};

// LOGIN USER
export const loginUser = (userData) => (dispatch) => {
  axios
    .post("/api/users/login", userData)
    .then((res) => {
      //Save to localStorage
      const { token } = res.data;
      // set token to local storage
      localStorage.setItem("jwtToken", token);
      // set token to auth-header
      setAuthToken(token);
      //decode token to get user data
      const decoded = jwt_decode(token);
      // set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// log user uot
export const logoutUser = () => (dispatch) => {
  // remove token from local storage
  localStorage.removeItem("jwtToken");
  // remove auth header
  setAuthToken(false);
  // set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
