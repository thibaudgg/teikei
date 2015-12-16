import React from 'react';
import request from 'superagent';

export default class Search extends React.Component {

  state = {
    value: this.props.defaultValue
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <input
        onChange={event => this.handleChange(event.target.value)}
        onKeyDown={event => this.handleKeyDown(event)}
        defaultValue={this.state.value}
        type='text'/>
    );
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      request
        .get('/api/v1/geocode')
        .query({location: this.state.value})
        .end(function(err, res) {
          if (err) {
            console.log(err);
          } else {
            Places.mapView.centerTo(res.body[0].attrs.lat, res.body[0].attrs.lon);
          }
        });
    }
  }

  handleChange(value) {
    this.setState({value});
  }
}
