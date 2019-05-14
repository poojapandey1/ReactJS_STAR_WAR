import React from 'react';
import '../plane_list/PlanetList.css';
import * as Constant from '../../utils/Constant';
import PropTypes from 'prop-types';

/**
 *
 * @param {*} props Function to find percentage of
 * population passed as props.
 */
function getPopulationPercent(props) {
  const percent = (props.population / props.max) * Constant.CONST_HUNDRED;
  return `${percent.toFixed(Constant.DECIMAL_PLACES)}`;
}

/**
 *
 * @param {*} props Function to det populations.
 */
function setPopulationDefault(props) {
  var newData = props.list.map(el =>
    el.population === Constant.TEXT_UNKOWN ? Constant.TEXT_ZERO : el.population
  );
  return newData;
}

/**
 *
 * @param {*} props Function to return list of Planet.
 */
function PlanetList(props) {
  const { planetList, showPlanetInfo } = props;
  const populationList = setPopulationDefault({ list: planetList });
  const max = populationList.reduce(
    (prev, current) => (parseInt(prev) > parseInt(current) ? prev : current),
    1
  );
  return (
    <div className="container h-100">
      {planetList.map((planet, index) => (
        <div
          className="PlanetList "
          key={planet.name}
          onClick={() => showPlanetInfo(planet)}
        >
          <h4 className="TextPadding">
            {planet.name}
            <span className="badge badge-danger float-right ">
              {getRelativePercent(index)}
            </span>
          </h4>
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped bg-danger"
              role="progressbar"
              style={{
                width: getRelativePercent(index)
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  /**
   *
   * @param {*} index Function to find relative percentage
   * to each other.
   */
  function getRelativePercent(index) {
    return `${getPopulationPercent({
      population: parseInt(populationList[index]),
      max: parseInt(max)
    })}%`;
  }
}

PlanetList.propTypes = {
  planetList: PropTypes.array.isRequired,
  showPlanetInfo: PropTypes.func.isRequired
};
export default PlanetList;
