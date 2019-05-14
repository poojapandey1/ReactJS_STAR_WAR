import React from 'react';
import ReactDOM from 'react-dom';
import PlanetInfo from '../planet_info/PlanetInfo';
import SearchScreen from '../search/SearchScreen';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <SearchScreen>
      <PlanetInfo />
    </SearchScreen>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
