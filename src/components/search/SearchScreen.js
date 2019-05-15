import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Webservice from '../../services/Service';
import PlanetList from '../plane_list/PlanetList';
import PlanetInfo from '../planet_info/PlanetInfo';
import '../planet_info/PlanetInfo.css';
import * as LocalStorage from '../../shared/LocalStorage';
import '../../components/search/SearchScreen.css';
import * as ErrorConstants from '../../utils/ErrorConstants';
import * as Constant from '../../utils/Constant';
import * as Sentry from '@sentry/browser';
import video from '../../assets/images/EarthSun-s.mp4';
import NotFound from '../../assets/images/Not-found.png';
import icon from '../../assets/images/startwar_icon1.png';
import Loader from '../../assets/images/Loader3.gif';
import { DebounceInput } from 'react-debounce-input';


/**
 * Search Screen component which enables to
 * serach for specified planet.
 */
class SearchSreen extends Component {
  //** State of components */
  state = {
    query: '',
    results: [],
    wholePlanetList: [],
    page: 1,
    scrolling: false,
    nextPageUrl: '',
    showPopup: false,
    planetInfo: {},
    timeCount: 60,
    isTimerRunning: false,
    apiCallCount: 0,
    searchDisable: false,
    loading: false
  };

  /**
   * Method to check for time interval
   * and restricting the further search
   * for specified interval of time.
   */
  tick() {
    if (this.state.timeCount === 0 && this.state.searchDisable === true) {
      this.setState({ timeCount: 60, searchDisable: false, apiCallCount: 0 });
      alert(ErrorConstants.ERROR_START_SEARCH);
    }
    this.setState({ timeCount: this.state.timeCount - 1 });
  }

  /**
   * Method to start the timer.
   */
  startTimer() {
    this.stopTimer();
    this.timer = setInterval(this.tick.bind(this), Constant.MILI_SEC);
  }

  /**
   * Method to stop timer.
   */
  stopTimer() {
    clearInterval(this.timer);
  }

  /**
   * Lifecycle hook for the component
   * Doing the clear the interval here.
   */
  componentWillMount() {
    clearInterval(this.timer);
    this.scrollListner = window.addEventListener('scroll', e => {
      this.handelScroll(e);
    });
    this.getWholePlanetList();
  }

  /**
   * Method to handle the scroll over the page.
   */
  handelScroll = () => {
    const { scrolling } = this.state;
    if (scrolling) return;
    const lastLi = document.querySelector('div > div:last-child');
    const lastLiOffSet = lastLi.offsetTop + lastLi.clientHeight;
    const pageOffset = window.pageYOffset + window.innerHeight;
    var bottomOffset = 0;
    if (this.state.nextPageUrl === null) return;
    if (pageOffset > lastLiOffSet - bottomOffset) this.getWholePlanetList();
  };

  /**
   * Method to get list of whole planet
   * from the API.
   */
  getWholePlanetList() {
    this.setState({
      loading: this.state.page === 1 ? true : false,
      scrolling: true,
      page: this.state.page + 1
    });
    const url = Constant.BASE_URL + `planets/?page=${this.state.page}`;
    Webservice({
      url: url,
      successCall: data => {
        this.setState({
          wholePlanetList: [...this.state.wholePlanetList, ...data.results],
          results: [...this.state.wholePlanetList, ...data.results],
          nextPageUrl: data.next,
          scrolling: false,
          loading: false
        });
      },
      errorCall: error => {
        this.setState({
          loading: true,
          results: [...this.state.wholePlanetList]
        });
      }
    });
  }

  /**
   * Method to validate the search made.
   */
  validateForSearch() {
    const { timeCount, apiCallCount } = this.state;
    if (LocalStorage.getUser() !== Constant.PRIME_USER) {
      if (timeCount > Constant.ZERO && apiCallCount < Constant.MAX_API_CALL) {
        return true;
      } else {
        this.stopTimer();
        this.setState(
          {
            timeCount: Constant.MAX_API_HIT_COUNT,
            searchDisable: true
          },
          () => this.startTimer()
        );
        alert(ErrorConstants.MESSAGE_LIMIT_EXCEED);
        return false;
      }
    }
    return true;
  }

  /**
   * Method of handle Input change while
   * making search for from API.
   */
  handleInputChange = e => {
    if (!this.state.isTimerRunning) {
      this.setState({ isTimerRunning: true });
      this.startTimer();
    }
    this.setState(
      {
        query: e.target.value,
        isTimerRunning: true,
      },
      () => {
        if (this.validateForSearch()) {
          this.setState({
            loading: true
          });
          this.fetchPlanetList();
        }
      }
    );
  };

  /**
   * Method to show information about the
   * planet and settiing state accordingly.
   */
  showPlanetInfo = (info, isHide) => {
    this.setState({
      planetInfo: info,
      showPopup: true
    });
  };

  /**
   * Method to hide planet information
   * when required.
   */
  hidePlanetInfo = () => {
    console.log('hidePlanetInfo');
    this.setState({
      showPopup: false
    });
  };

  /**
   * Method to fetch the planet list matching
   *  with entered planet name.
   */
  fetchPlanetList() {
    const { query } = this.state;
    if (query.length > 2) {
      const url = Constant.PLANET + query;
      Webservice({
        url: url,
        successCall: data => {
          this.setState({
            results: data.results,
            page: 1,
            loading: false,
            apiCallCount: this.state.apiCallCount + 1

          });
        },
        errorCall: error => {
          this.setState({
            loading: false,
            results: [...this.state.wholePlanetList]
          });
        }
      });
    } else {
      this.setState({
        results: this.state.wholePlanetList,
        page: 1,
        loading: false
      });
    }
  }

  /**
   * Handle error at the component level.
   * Making use of Sentry API to sending error
   * log to server with all details.
   * @param {*} error erro occured
   * @param {*} errorInfo detaild infor about the error.
   */
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
    this.setState({ error });
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  /**
   * Method to handle the logout.
   */
  logoutClicked() {
    if (window.confirm(ErrorConstants.MESSAGE_CONFIRM_LOGOUT)) {
      LocalStorage.removeUser();
      browserHistory.push('/Login');
    }
  }

  /**
   * Method to update UI according to state change.
   * By default it returns true.
   * @param {*} nextProps
   * @param {*} nextState
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { results, showPopup } = this.state;
    if (results !== nextState.results || showPopup !== nextState.showPopup)
      return true;
    return false;
  }

  /**
   * Method to render the UI for
   * Search screen.
   */
  render() {
    if (!LocalStorage.getUser()) {
      browserHistory.push('/Login');
    }
    const popup = this.state.showPopup ? (
      <PlanetInfo
        value={this.state.planetInfo}
        hidePlanetInfo={this.hidePlanetInfo}
      />
    ) : null;
    return (
      <div className="SearchScreenBody Scroll-lock overlay">
        <video id="myVideo" autoPlay muted loop>
          <source src={video} type="video/mp4" />
        </video>
        {this.setupNavigationBar()}
        {popup}
        {this.setUpSearchList()}
      </div>
    );
  }

  /**
   * Method to set up the Navigation bar which contains Username, Search bar and logout button
   */
  setupNavigationBar() {
    return (
      <nav className="navbar NavBarColor">
        <img src={icon} className="imgIcon" alt="icon" />
        <h4 className="Welcome ">{LocalStorage.getUser()}</h4>
        <DebounceInput
          className="form-control SearchBar mr-sm-2"
          type="search"
          placeholder="Search planet"
          minLength={2}
          debounceTimeout={1000}
          onChange={this.handleInputChange}
          disabled={this.state.searchDisable}
        />
        <button
          className="btn btn-outline-danger my-2 my-sm-0  btn-sm"
          type="submit"
          onClick={() => this.logoutClicked()}
        >
          Logout
        </button>
      </nav>
    );
  }

  /**
   * Method to set up Search result list.
   */
  setUpSearchList() {
    return (
      <div className="SearchResult container">
        {console.log('this.state.results', this.state.results)}
        <PlanetList
          planetList={this.state.results}
          showPlanetInfo={this.showPlanetInfo}
        />
        <br />
        {this.state.loading ? (
          <div className="d-flex justify-content-center">
            <img
              src={Loader}
              alt="loader"
              className="LoaderImage justify-self-center"
            />
          </div>
        ) : this.state.results.length === 0 ? (
          <div className="d-flex justify-content-center">
            <img src={NotFound} alt="loader" className=" justify-self-center" />
          </div>
        ) : null}
      </div>
    );
  }
}

export default SearchSreen;
