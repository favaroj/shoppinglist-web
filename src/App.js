import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

class App extends Component {

  constructor() {
    super();
    this.state = {
      listName: '',
      lists: [],
      showDelModal: false,
      showEditModal: false,
      showItemEditModal: false,
      showItemDelModal: false,
      showListModal: false,
      listTitle: '', 
      listId: '',
      items: [],
      itemName: '',
      itemId: '',
      itemTitle: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleItemSubmit = this.handleItemSubmit.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleDelShow = this.handleDelShow.bind(this);
    
    this.handleDelClose = this.handleDelClose.bind(this);
    this.handleEditShow = this.handleEditShow.bind(this);
    this.handleItemEditShow = this.handleItemEditShow.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
    this.handleListClose = this.handleListClose.bind(this);
    this.handleItemEditClose = this.handleItemEditClose.bind(this);
    this.handleItemDelClose = this.handleItemDelClose.bind(this);
  }

  editList(listId, listTitle) {
      const listRef = firebase.database().ref(`/Lists/${listId}`);
      const title = {
        title: this.state.listTitle,
      }
      listRef.update({
        title: listTitle
      });
      alert(listTitle + ' has been edited!');
      //this.handleEditClose();
  }

  editItem(itemId, itemTitle) {
    //alert(itemId +':' +this.state.itemTitle);
    const listRef = firebase.database().ref(`/Lists/${this.state.listId}/${itemId}`);
    
    listRef.update({
      title: this.state.itemTitle
    });
  }

  deleteItem(itemId, itemTitle) {
    const listRef = firebase.database().ref(`/Lists/${this.state.listId}/${itemId}`);
    listRef.remove();
    this.handleItemDelClose();
  }

  removeList(listId, listTitle) {
      const listRef = firebase.database().ref(`/Lists/${listId}`);
      listRef.remove();
      alert(listTitle + ' has been deleted!');
      this.handleDelClose();
  }

  handleDelClose() {
		this.setState({ showDelModal: false });
	}

	handleDelShow(listId, listTitle) {
    this.setState({
      listTitle: listTitle,
      listId: listId
    });
		this.setState({ showDelModal: true });
  }
  
  handleEditClose() {
		this.setState({ showEditModal: false });
  }
  
  handleListClose() {
		this.setState({ showListModal: false });
  }
  
  handleItemEditClose() {
		this.setState({ showItemEditModal: false});
  }
  
  handleItemDelClose() {
		this.setState({ showItemDelModal: false});
	}

	handleEditShow(listId, listTitle) {
    this.setState({
      listTitle: listTitle,
      listId: listId
    });
		this.setState({ showEditModal: true });
  }
  
  handleItemEditShow(itemId, itemTitle) {
    this.setState({
      itemTitle: itemTitle,
      itemId: itemId
    });
    this.setState({ showItemEditModal: true});
  }

  handleItemDelShow(itemId, itemTitle) {
    this.setState({
      itemId: itemId,
      itemTitle: itemTitle,
      showItemDelModal: true
    });
  }

  /*handleEdit(e) {
    var newName = prompt("Update the item name", name);
    console.log(key);

    if (key && newName.length > 0) {

        // Build the FireBase endpoint to the item
        var updateRef = buildEndPoint(key);
        updateRef.update({
            title: newName
        });
    }
  }*/

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('Lists');
    const item = {
      title: this.state.listName,
    }
    itemsRef.push(item);
    this.setState({
      listName: ''
    });
  }

  handleItemSubmit(e) {
    console.log(this.state.listId);
    e.preventDefault();
    const itemsRef = firebase.database().ref(`Lists/${this.state.listId}`);
    const item = {
      title: this.state.itemName,
    }
    itemsRef.push(item);
    this.setState({
      itemName: ''
    });
  }

  handleEditSubmit(e) {
    //e.preventDefault();
    const listRef = firebase.database().ref(`/Lists/${this.state.listId}`);
      const title = {
        title: this.state.listTitle,
      }
      listRef.update({
        title: title
      });
      alert(this.state.listTitle + ' has been edited!');
      this.handleEditClose();
    this.setState({
      listTitle: ''
    });
  }

  showList(listId, listTitle) {
    const listRef = firebase.database().ref('Lists');
    listRef.child(listId).on('value', (snapshot) => {
        let items = snapshot.val();
        let childState = [];
        for (let item in items) {
          if(typeof(items[item].title) !== 'undefined') {
            childState.push({
              id: item,
              title: items[item].title
            });
          }
        }
        this.setState({
          items: childState
        });
    });
    this.setState({
      listTitle: listTitle,
      listId: listId
    });
    this.setState({
      showListModal: true
    });
    alert(listTitle);
  }

  componentDidMount() {
    const listRef = firebase.database().ref('Lists');
    listRef.on('value', (snapshot) => {
      let lists = snapshot.val();
      let newState = [];
      let childState = [];
      for (let list in lists) {
        if(typeof(lists[list].title) !== 'undefined') {
          listRef.child(list).on('value', (child) => {
            let count = child.numChildren();
            let adjCount = count - 1;
            newState.push({
              id: list,
              title: lists[list].title,
              count: adjCount
            });
          })
          
        }
      }
      this.setState({
        lists: newState
      });
    });
  }

  render() {
    return (
      <div id='App' className='container-fluid'>
        <header>
          <div className='wrapper'>
            <img src="shoppingCart-image.png" className="App-logo" alt="logo"/>
            <h1>List Portal<hr className="hrFormat"/></h1>  
          </div>
        </header>
        <form id="createListDiv" className="jumbotron" onSubmit={this.handleSubmit}>
          <h3 className="letterSpacing">Create List</h3>
          <input id="submitText" type="text" name="listName" placeholder="New List" value={this.state.listName} onChange={this.handleChange}/>
          <button id="submitBtn" className="btn btn-success btn-lg btn-block">Create</button>
        </form>
        <hr className="hrFormat" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '30px'}}/>
        <section className="jumbotron" id="mainListSection">
          <div className="wrapper">

          <h2 className="letterSpacing">Current Lists</h2>
          <hr className="hrFormat" style={{borderColor: '#343a40', marginLeft: '10px', marginRight: '10px'}}/>
          <ul id="mainList">
            {this.state.lists.map((list) => {
              return (
                <li className="mainList" key={list.id}>
                  <button id="listBtns" onClick={() => this.showList(list.id, list.title)}>{list.title}<div> {list.count > 0 && <p style={{  color:'red' }}>{list.count} Item(s)</p>} {list.count == 0 && <p style={{  color:'green' }}>{list.count} Item(s)</p>}</div><hr style={{marginBottom: '0px'}}/><br/><button onClick={() => this.handleEditShow(list.id, list.title)} id="editDelBtn" className="btn btn-success btn-sm">Edit</button><button onClick={() => this.handleDelShow(list.id, list.title)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button></button>
                </li>
              )
            })}
          </ul>
          </div>
        </section>

        {/*SHOW LIST MODAL*/}
        <Modal show={this.state.showListModal} onHide={this.handleListClose}>
					<Modal.Header closeButton>
						<Modal.Title id="listModalTitle">{this.state.listTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
          <form id="addItemDiv" className="jumbotron" onSubmit={this.handleItemSubmit}>
          <h3 className="letterSpacing">Add Item</h3>
          <input id="addItemText" type="text" name="itemName" placeholder="New Item" value={this.state.itemName} onChange={this.handleChange}/>
          <button id="submitBtn" className="btn btn-success btn-sm btn-block">Add</button>
        </form>
          <ol style={{fontSize: "20px"}}>
            {this.state.items.map((item) => {
              return (
                <li id="items" key={item.id}>
                  <div><p>{item.title}<button onClick={() => this.handleItemEditShow(item.id, item.title)} id="editDelBtn" className="btn btn-success btn-sm">Edit</button><button onClick={() => this.handleItemDelShow(item.id, item.title)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button></p></div>
                </li>
              )
            })}
          </ol>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.handleListClose}>Close</Button>
					</Modal.Footer>
				</Modal>

        {/*DELETE ITEM MODAL*/}
        <Modal show={this.state.showItemDelModal} onHide={this.handleItemDelClose}>
					<Modal.Header closeButton>
						<Modal.Title id="listModalTitle">{this.state.idTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>Are you sure you would like to delete <strong>{this.state.itemTitle}?</strong></h4>
					</Modal.Body>
					<Modal.Footer>
          <button onClick={() => this.deleteItem(this.state.itemId, this.state.itemTitle)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
						<Button onClick={this.handleItemDelClose}>Close</Button>
					</Modal.Footer>
				</Modal>

        {/*EDIT ITEM MODAL*/}
        <Modal show={this.state.showItemEditModal} onHide={this.handleItemEditClose}>
					<Modal.Header closeButton>
						<Modal.Title id="listModalTitle">{this.state.itemTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
          {/*<form id="addItemDiv" className="jumbotron" onSubmit={this.editItem}>*/}
          <div id="addItemDiv">
          <h3 className="letterSpacing">Edit Item</h3>
          <input id="addItemText" type="text" name="itemTitle" placeholder={this.state.itemTitle} value={this.state.itemTitle} onChange={this.handleChange}/>
          <button id="submitBtn" onClick={() => this.editItem(this.state.itemId, this.state.idTitle)} className="btn btn-success btn-sm btn-block">Edit</button>
          </div>
        {/*</form>*/}
          {/*<form id="editItemDiv" className="jumbotron" onSubmit={this.editItem}>
            <input id="submitText" type="text" name="itemTitle" placeholder={this.state.itemTitle} value={this.state.itemTitle} onChange={this.handleChange} />
						<button onClick={() => this.editItem(this.state.itemId, this.state.idTitle)} className="btn btn-success btn-sm">Edit</button>
          </form>*/}
					</Modal.Body>
					<Modal.Footer>  
						<Button onClick={this.handleItemEditClose}>Close</Button>
					</Modal.Footer>
          </Modal>     
      
        
        {/*DELETE LIST MODAL*/}
        <Modal show={this.state.showDelModal} onHide={this.handleDelClose}>
					<Modal.Header closeButton>
						<Modal.Title id="listModalTitle">{this.state.listTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>Are you sure you would like to delete {this.state.listTitle}?</h4>
					</Modal.Body>
					<Modal.Footer>
          <button onClick={() => this.removeList(this.state.listId, this.state.listTitle)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
						<Button onClick={this.handleDelClose}>Close</Button>
					</Modal.Footer>
				</Modal>

        {/*EDIT LIST MODAL*/}
        <Modal show={this.state.showEditModal} onHide={this.handleEditClose}>
					<Modal.Header closeButton>
						<Modal.Title id="listModalTitle">{this.state.listTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
          <h4 style={{textAlign: "center"}}>Edit The List Name:</h4>
          <form id="createListDiv" className="jumbotron" onSubmit={this.editList}>
            <input id="submitText" type="text" name="listTitle" placeholder={this.state.listTitle} value={this.state.listTitle} onChange={this.handleChange} />
						<button onClick={() => this.editList(this.state.listId, this.state.listTitle)} className="btn btn-success btn-sm">Edit</button>
          </form>
					</Modal.Body>
					<Modal.Footer>  
						<Button onClick={this.handleEditClose}>Close</Button>
					</Modal.Footer>
          </Modal>     
      </div>
    );
  }
}

export default App;
