import React from 'react';
import ReactDOM from 'react-dom';
import SearchScreen from '../search/SearchScreen';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchScreen />, div);
  ReactDOM.unmountComponentAtNode(div);
});
