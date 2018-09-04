import React, { Component } from 'react';
import './App.css';
import menu from './menu.png'
import classnames from 'classnames';
import List from './List'

class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        category:"All",
        active: false
    }
  }

    findByCategory = (event) => {
      this.setState({ category: event })
    }

    click = () =>{
      let check;
      if (this.state.active === true) {
        check = false;
      } else {
        check =true
      }
      this.setState( {active: check});
    }

    render() {
      const {category,active} = this.state;

      /* https://www.reddit.com/r/reactjs/comments/36cbhr/how_do_you_toggle_a_css_class_on_click_in_react/
        check classes for usability to show or hide menu */
      let classes = classnames('menu', {'show': active});

      return (
            <div>
              <header>
                  <span tabIndex="1">Neighborhood Map</span>
                  <div className="open">
                      <button onClick={this.click.bind(this)} tabIndex="2"><img src={menu} alt="menu" width="40" height="40"/></button>
                  </div>
              </header>
              <div className={classes}>
                  <div>
                      <select id="list" tabIndex="3" onChange={event => this.findByCategory(event.target.value)}>
                        <option value="All">All</option>
                        <option value="Museum">Museum</option>
                        <option value="Park">Park</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Entertainment">Entertainment</option>
                      </select>
                  </div>
                  <List
                  category={category} />
              </div>
                <div id="map-container" role="application" tabIndex="-1">
                <div id="map" role="region" aria-label="Neighborhood Map"></div>
              </div>
            </div>
        );
    }
  }

export default App;
