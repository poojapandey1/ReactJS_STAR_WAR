import React from 'react';
import './PlanetInfo.css';
import PropTypes from 'prop-types';

/**
 * COnstant to return image URL
 */
const createImageURL = name => {
  try {
    return require('../../assets/images/' + name + '.png');
  } catch (err) {
    return '../../assets/images/' + name + '.png';
  }
};

/**
 * Function to render Planet Information UI.
 * @param {*} props Function component to
 * retrun Planet info popup.
 */
function PlanetInfo(props) {
  const planet = props.value;
  return (
    <div className="PlanetInfoBase modal-body">
      <div className="InnerBase ">
        <h1>Planet Information</h1>
        <button className="Button" onClick={props.hidePlanetInfo}>
          X
        </button>
        <div className="Row">
          <div className="PlanetImage">
            <img
              src={createImageURL(planet.name)}
              alt={planet.name + '.png'}
              className="Image"
            />
            <h1>{planet.name}</h1>
          </div>
          <div className="PlanetDetail">
            <h5>Name:&nbsp; {planet.name}</h5>
            <h5>Rotational Period:&nbsp; {planet.rotation_period}</h5>
            <h5>Orbital Period:&nbsp; {planet.orbital_period}</h5>
            <h5>Diameter:&nbsp; {planet.diameter}</h5>
            <h5>Climate:&nbsp; {planet.climate}</h5>
            <h5>Gravity:&nbsp; {planet.gravity}</h5>
            <h5>Terrain:&nbsp; {planet.terrain}</h5>
            <h5>Surface Water:&nbsp; {planet.surface_water}</h5>
            <h5>Population:&nbsp; {planet.population}</h5>

            {/* {console.log('planet.name', planet.name)}
            {Object.keys(planet).map((item, index) => (
              <h6 key={item}>
                {item}:&nbsp;{planet[item]}
              </h6>
            ))} */}
          </div>
          {/* <div>
            <img src={ImgPlanetInfo} alt="loader" className="LoaderImage" />
          </div> */}
        </div>
      </div>
    </div>
  );
}
PlanetInfo.propTypes = {
  value: PropTypes.object.isRequired
};
export default PlanetInfo;
