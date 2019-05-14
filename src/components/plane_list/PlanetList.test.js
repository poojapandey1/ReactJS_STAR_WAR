import React from 'react';
import ReactDOM from 'react-dom';
import PlanetList from '../plane_list/PlanetList';
import SearchScreen from '../search/SearchScreen';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <SearchScreen>
      <PlanetList />
    </SearchScreen>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
