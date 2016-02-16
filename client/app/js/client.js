const React = require('react');
const ReactDOM = require('react-dom');
const jquery = require('jquery');
const baseUri = 'http://localhost:3000/api/bears';

//React Classes
var CreateBearForm = React.createClass({
  displayName: 'CreateBearForm',
  getInitialState: function() {
    return({bearName: '', bearFlavor: ''});
  },
  handleNameChange: function(e) {
    this.setState({bearName: e.target.value});
  },
  handleFlavorChange: function(e) {
    this.setState({bearFlavor: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var bearName = this.state.bearName.trim(), bearFlavor = this.state.bearFlavor.trim();
    if (!bearName || !bearFlavor) return;
    this.onFormSubmit({name: bearName, flavor: bearFlavor});
    this.setState({bearName: '', bearFlavor: ''});
  },
  onFormSubmit: function(newBear) {
    bearPOSTRequest(newBear, renderBearsDisplay);
  },
  render: function() {
    return (
      <form className="createBearForm" onSubmit={this.handleSubmit} >
        <input type="text" placeholder="Bear name" value={this.state.bearName} onChange={this.handleNameChange} />
        <input type="text" placeholder="Bear flavor" value={this.state.bearFlavor} onChange={this.handleFlavorChange} />
        <input type="submit" value="Create Bear" />
      </form>
    );
  }
});
var BearDisplay = React.createClass({
  displayName: 'BearDisplay',
  getInitialState: function() {
    return({bearName: this.props.name, bearFlavor: this.props.flavor});
  },
  handleNameChange: function(e) {
    this.setState({bearName: e.target.value});
  },
  handleFlavorChange: function(e) {
    this.setState({bearFlavor: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var bearName = this.state.bearName.trim(), bearFlavor = this.state.bearFlavor.trim();
    if (!bearName || !bearFlavor) return;
    this.onUpdateClick(e, {name: bearName, flavor: bearFlavor});
  },
  onUpdateClick: function(e, newBear) {
    e.preventDefault();
    var bearId = this.props._id;
    var uri = baseUri + '/' + bearId;
    //console.log('Update URI: ' + uri);
    bearPUTRequest(newBear, uri, renderBearsDisplay);
  },
  onDeleteClick: function(e) {
    e.preventDefault();
    var bearId = this.props._id;
    var uri = baseUri + '/' + bearId;
    //console.log('Delete URI: ' + uri);
    bearDELETERequest(uri, renderBearsDisplay);
  },
  render: function() {
    return (
      <form className="bearDisplay" >
        <input type="text" placeholder="New bear name" value={this.state.bearName} onChange={this.handleNameChange} />
        <input type="text" placeholder="New bear flavor" value={this.state.bearFlavor} onChange={this.handleFlavorChange} />
        <input type="submit" value="Update" onClick={this.handleSubmit} />
        <input type="submit" value="Delete" onClick={this.onDeleteClick} />
      </form>
    );
  }
});

//Render the application.
renderCreateBearForm();
renderBearsDisplay();

//Render Functions
function renderCreateBearForm() {
  jquery('#createBear').remove();
  jquery('<section id="createBear"></section>').appendTo('#bearApplication');
  ReactDOM.render(React.createElement(CreateBearForm, null), document.getElementById('createBear'));
  jquery('<h2 id="createBearHeader">Create a New Bear</h2>').prependTo('#createBear');
}
function renderBearsDisplay() {
  jquery('#bearDisplays').remove();
  jquery('<section id="bearDisplays"><h2 id="bearDisplaysHeader">Bears in Super Wrangler\'s Den</h2></section>').appendTo('#bearApplication');
  bearGETRequest(renderBearDisplays);
}
function renderBearDisplays(data) {
  //console.log('Rendering bear displays.');
  var bears = data.message;
  if (!bears.length) jquery('#bearDisplaysHeader').remove();
  if (bears.length) jquery('#bearDisplaysHeader').css('display', 'block');
  for(var i = 0; i < bears.length; i++) {
    var id = 'bearsDisplay-' + i.toString();
    var jqueryID = '#' + id;
    jquery(jqueryID).remove();
    var tag = '<section id="' + id + '"></section>';
    jquery(tag).appendTo('#bearDisplays');
    ReactDOM.render(React.createElement(BearDisplay, bears[i]), document.getElementById(id));
  }
  //console.log('Rendering bear displays complete.');
  //console.log();
}

//AJAX Requests
function bearGETRequest(callback) {
  jquery.ajax({
    url: baseUri,
    type: 'GET',
    success: function(data) {
      //console.log('GET request completed!');
      //console.log(data);
      callback(data);
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(baseUri, status, err.toString());
    }.bind(this)
  });
}
function bearPOSTRequest(newBear, callback) {
  jquery.ajax({
    url: baseUri,
    dataType: 'json',
    type: 'POST',
    data: JSON.stringify(newBear),
    success: function(data) {
      //console.log('POST request completed!');
      //console.log(data);
      callback();
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(baseUri, status, err.toString());
    }.bind(this)
  });
}
function bearPUTRequest(newBear, uri, callback) {
  jquery.ajax({
    url: uri,
    dataType: 'json',
    type: 'PUT',
    data: JSON.stringify(newBear),
    success: function(data) {
      //console.log('PUT request completed!');
      //console.log(data);
      callback();
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(baseUri, status, err.toString());
    }.bind(this)
  });
}
function bearDELETERequest(uri, callback) {
  jquery.ajax({
    url: uri,
    type: 'DELETE',
    success: function(data) {
      //console.log('DELETE request completed!');
      //console.log(data);
      callback();
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(baseUri, status, err.toString());
    }.bind(this)
  });
}
