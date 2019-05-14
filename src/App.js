import React from 'react';
import Login from './components/login/Login';
import '../src/utils/bootstrap.min.css';
import SearchScreen from './components/search/SearchScreen';
import { Router, Route, browserHistory } from 'react-router';
import PageNotFound from './components/page_not_found/PageNotFround';
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://eaa85ad988644e4e91c456ea51d83a00@sentry.io/1457430'
});
// Sentry.captureException(new Error('This is my fake error message'));

/**
 * Main App component.
 */
function App() {
  return (
    <Router history={browserHistory}>
      <Route path="/" exact component={Login} />
      <Route path="/Login" component={Login} />
      <Route path="/SearchScreen" component={SearchScreen} />
      <Route path="*" component={PageNotFound} />
    </Router>
  );
}
export default App;
