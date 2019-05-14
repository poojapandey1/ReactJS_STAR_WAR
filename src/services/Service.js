import axios from 'axios';

/**
 * Function to make webservice call.
 * This service will make get request
 * to the API and get the result.
 * On error log the error.
 * @param {*} props: props contains url, success block and error block
 */
function Webservice(props) {
  axios
    .get(props.url)
    .then(({ data }) => props.successCall(data))
    .catch(({ error }) => {
      alert(error);
      props.errorCall(error);
    });
}

export default Webservice;
