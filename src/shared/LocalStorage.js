import * as constant from '../utils/Constant';

/**
 * Function to get User details.
 */
export function getUser() {
  const user = localStorage.getItem(constant.USERINFO);
  return user;
}

/**
 * Function to Set user details.
 * @param {*} props
 */
export function setUser(props) {
  localStorage.setItem(constant.USERINFO, props);
}

/**
 * Function to Remove user details.
 * @param {*} props
 */
export function removeUser() {
  localStorage.removeItem(constant.USERINFO);
}
