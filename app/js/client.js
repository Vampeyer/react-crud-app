const React = require('react');
const ReactDOM = require('react-dom');
const jquery = require('jquery');
const baseUri = 'http://localhost:3000/api/bears';

var BearForm = React.createClass({displayName: 'BearForm',
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
   var bearName = this.state.bearName.trim();
   var bearFlavor = this.state.bearFlavor.trim();
   if (!bearName || !bearFlavor) {
     return;
   }
    this.onCommentSubmit({name: bearName, flavor: bearFlavor});
    this.setState({bearName: '', bearFlavor: ''});
  },
  onCommentSubmit: function(newBear) {
    console.log(newBear);
    jquery.ajax({
       url: baseUri,
      //  dataType: 'json',
       type: 'POST',
       data: JSON.stringify(newBear),
       success: function(data) {
         console.log('Post request completed!');
         console.log(data);
         // this.setState({data: data});
       }.bind(this),
       error: function(xhr, status, err) {
         console.error(baseUri, status, err.toString());
       }.bind(this)
     });
  },
  render: function() {
    return(
      <form className="bearForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Bear name" value={this.state.bearName} onChange={this.handleNameChange}/>
        <input type="text" placeholder="Bear flavor" value={this.state.bearFlavor} onChange={this.handleFlavorChange}/>
        <input type="submit" value="Post"/>
      </form>
    )
  }
});

ReactDOM.render(
  React.createElement(BearForm, null),
  document.getElementById('createBear')
);
