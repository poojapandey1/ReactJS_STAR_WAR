import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { mount, shallow, render } from 'enzyme';
import Login from './Login';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

const state = {
  username: 'Luke Skywalker',
  password: '19BBY',
  loading: false
};

// describe what we are testing
describe('Login Component', () => {
  // make our assertion and what we expect to happen
  it('should render without throwing an error', () => {
    expect(
      shallow(<Login />)
        .find('div')
        .exists()
    ).toBe(true);
  });

  // within the Login components describe function
  it('renders a username input', () => {
    expect(shallow(<Login />).find('#username').length).toEqual(1);
  });

  it('renders a password input', () => {
    expect(shallow(<Login />).find('#password').length).toEqual(1);
  });

  describe('username input', () => {
    it('should respond to change event and change the state of the Login Component', () => {
      const wrapper = shallow(<Login />);
      wrapper.find('#username').simulate('change', {
        target: { name: 'username', value: 'blah@gmail.com' }
      });

      expect(wrapper.state('username')).toEqual('blah@gmail.com');
    });
  });

  describe('Password input', () => {
    it('should respond to change event and change the state of the Login Component', () => {
      const wrapper = shallow(<Login />);
      wrapper
        .find('#password')
        .simulate('change', { target: { name: 'password', value: 'cats' } });

      expect(wrapper.state('password')).toEqual('cats');
    });
  });
});
