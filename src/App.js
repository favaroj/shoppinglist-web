import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

class App extends Component {

  constructor() {
    super();
    this.state = {
      showDelModal: false,
      showEditModal: false,
      showItemEditModal: false,
      showItemDelModal: false,
      showListModal: false,
      showSubListModal: false,
      showSubListEditModal: false,
      showSubListDelModal: false,

      lists: [],
      listName: '',
      listTitle: '',
      listId: '',

      subLists: [],
      subListName: '',
      subListTItle: '',
      subListId: '',

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

    this.handleSubListSubmit = this.handleSubListSubmit.bind(this);
    this.handleSubListClose = this.handleSubListClose.bind(this);
    this.handleSubListEditClose = this.handleSubListEditClose.bind(this);
    this.handleSubListDelClose = this.handleSubListDelClose.bind(this);
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
      //alert(listTitle + ' has been edited!');
      //this.handleEditClose();
  }

  editSubList(itemId, subListTitle) {
    const listRef = firebase.database().ref(`/Lists/${this.state.listId}/${itemId}`);
    listRef.update({
      title: this.state.subListTitle
    });
  }

  editItem(itemId, itemTitle) {
    //alert(itemId +':' +this.state.itemTitle);
    const listRef = firebase.database().ref(`/Lists/${this.state.listId}/${this.state.subListId}/${itemId}`);

    listRef.update({
      title: this.state.itemTitle
    });
  }

  deleteItem(itemId, itemTitle) {
    const listRef = firebase.database().ref(`/Lists/${this.state.listId}/${this.state.subListId}/${itemId}`);
    listRef.remove();
    this.handleItemDelClose();
  }

  removeList(listId, listTitle) {
      const listRef = firebase.database().ref(`/Lists/${listId}`);
      listRef.remove();
      //alert(listTitle + ' has been deleted!');
      this.handleDelClose();
  }

  removeSubList(subListId, subListTitle) {
    const listRef = firebase.database().ref(`/Lists/${this.state.listId}/${subListId}`);
    listRef.remove();
    //alert(subListTitle + ' has been deleted!');
    this.handleSubListDelClose();
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

  handleSubListClose() {
		this.setState({ showSubListModal: false });
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

  handleSubListEditClose() {
    this.setState({ showSubListEditModal: false });
  }

  handleSubListEditShow(subListId, subListTitle) {
    this.setState({
      subListTitle: subListTitle,
      subListId: subListId
    });
    this.setState({ showSubListEditModal: true});
  }

  handleSubListDelShow(subListId, subListTitle) {
    this.setState({
      subListTitle: subListTitle,
      subListId: subListId,
      showSubListDelModal: true
    });
  }

  handleSubListDelClose() {
    this.setState({
      showSubListDelModal: false
    })
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
    // Get a key for a new List.
    var newListKey = itemsRef.push().key;
    const item = {
      title: this.state.listName,
    }
    itemsRef.push(item).key;
    this.setState({
      listName: ''
    });
  }

  handleSubListSubmit(e) {
    console.log(this.state.listId);
    e.preventDefault();
    const itemsRef = firebase.database().ref(`Lists/${this.state.listId}`);
    const item = {
      title: this.state.itemName,
    }
    var newRef = itemsRef.push(item).key;
    /*itemsRef.child(newRef).push({
      title: 'Default Item'
    });*/
    this.setState({
      itemName: ''
    });
  }

  handleItemSubmit(e) {
    console.log(this.state.listId);
    e.preventDefault();
    const itemsRef = firebase.database().ref(`Lists/${this.state.listId}/${this.state.subListId}`);
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
      //alert(this.state.listTitle + ' has been edited!');
      //this.handleEditClose();
      this.setState({});
    this.setState({
      showEditModal: false,
      listTitle: ''
    });
  }

  showList(listId, listTitle) {
    const listRef = firebase.database().ref('Lists');
    listRef.child(listId).on('value', (snapshot) => {
        let subLists = snapshot.val();
        let subListState = [];
        for (let subList in subLists) {
          if(typeof(subLists[subList].title) !== 'undefined') {
            listRef.child(listId).child(subList).on('value', (child) => {
              let count = child.numChildren();
              let adjCount = count - 1;
            subListState.push({
              id: subList,
              title: subLists[subList].title,
              count: adjCount
            });
          });
          }
        }
        this.setState({
          subLists: subListState
        });
    });
    this.setState({
      listTitle: listTitle,
      listId: listId
    });
    this.setState({
      showListModal: true
    });
  }

  showItems(subListId, subListTitle) {
    const listRef = firebase.database().ref('Lists');
    listRef.child(this.state.listId).child(subListId).on('value', (snapshot) => {
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
      subListTitle: subListTitle,
      subListId: subListId
    });
    this.setState({
      showSubListModal: true
    });
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
          <button id="submitBtn" className="btn btn-success btn-lg btn-block" >Create</button>
        </form>
        <hr className="hrFormat" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '30px'}}/>
        <section className="jumbotron" id="mainListSection">
          <div className="wrapper">

          <h2 className="letterSpacing">Current Lists</h2>
          <hr className="hrFormat" style={{borderColor: '#343a40', marginLeft: '10px', marginRight: '10px'}}/>
          <ul id="mainList">
            {this.state.lists.map((list) => {
              return (
                <li className="mainItems" key={list.id}>
                  <button id="listBtns" onClick={() => this.showList(list.id, list.title)}>{list.title}{/*<div> {list.count > 0 && <p style={{  color:'red' }}>{list.count} List(s)</p>} {list.count == 0 && <p style={{  color:'green' }}>{list.count} List(s)</p>}</div>*/}</button>
                  <button onClick={() => this.handleEditShow(list.id, list.title)} id="editDelBtn" className="btn btn-success btn-sm">Edit Name</button><button onClick={() => this.handleDelShow(list.id, list.title)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
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
          <form id="addItemDiv" className="jumbotron" onSubmit={this.handleSubListSubmit}>
          <h3 className="letterSpacing">Add List</h3>
          <input id="addItemText" type="text" name="itemName" placeholder="New Item" value={this.state.itemName} onChange={this.handleChange}/>
          <button id="submitBtn" className="btn btn-success btn-sm btn-block">Add</button>
        </form>
          <ol style={{fontSize: "20px", textAlign: "center"}}>
            {this.state.subLists.map((subList) => {
              return (
                <li id="items" key={subList.id}>
                  <button id="listBtns" onClick={() => this.showItems(subList.id, subList.title)}>{subList.title}<div> {subList.count > 0 && <p style={{  color:'red' }}>{subList.count} Item(s)</p>} {subList.count == 0 && <p style={{  color:'green' }}>{subList.count} Item(s)</p>}</div></button><button onClick={() => this.handleSubListEditShow(subList.id, subList.title)} id="editDelBtn" className="btn btn-success btn-sm">Edit Name</button><button onClick={() => this.handleSubListDelShow(subList.id, subList.title)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
                  {/*<div><p>{item.title}<button onClick={() => this.handleItemEditShow(item.id, item.title)} id="editDelBtn" className="btn btn-success btn-sm">Edit</button><button onClick={() => this.handleItemDelShow(item.id, item.title)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button></p></div>*/}
                </li>
              )
            })}
          </ol>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.handleListClose}>Close</Button>
					</Modal.Footer>
				</Modal>

        {/*SHOW SUBLIST MODAL*/}
        <Modal show={this.state.showSubListModal} onHide={this.handleSubListClose}>
					<Modal.Header closeButton>
						<Modal.Title id="listModalTitle">{this.state.subListTitle}</Modal.Title>
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
                  <div><p>{item.title}<a onClick={() => this.handleItemEditShow(item.id, item.title)} id="editDelBtn" ><i id="editIcon" className="fas fa-edit"></i></a><a onClick={() => this.handleItemDelShow(item.id, item.title)} id="editDelBtn"><i id="delIcon" className="fas fa-trash-alt"></i></a></p></div>
                </li>
              )
            })}
          </ol>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.handleSubListClose}>Close</Button>
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
          <button id="submitBtn" onClick={() => {this.editItem(this.state.itemId, this.state.idTitle); this.setState({showItemEditModal: false});}} className="btn btn-success btn-sm btn-block" data-dismiss="modal">Submit</button>
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

        {/*EDIT SUBLIST MODAL*/}
        <Modal id="modalFormat" show={this.state.showSubListEditModal} onHide={this.handleSubListEditClose}>
					<Modal.Header closeButton>
						<Modal.Title id="listModalTitle">{this.state.subListTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
          <div id="addItemDiv">
          <h3 className="letterSpacing">Edit The List Name:</h3>
          {/*<form id="createListDiv" className="jumbotron" onSubmit={this.editList}>*/}

            <input id="submitItem" type="text" name="subListTitle" placeholder={this.state.subListTitle} value={this.state.subListTitle} onChange={this.handleChange} />
						<button id="submitBtn" onClick={() => {this.editSubList(this.state.subListId, this.state.subListTitle); this.setState({showSubListEditModal: false});}} className="btn btn-success btn-sm">Submit</button>
          </div>
          {/*</form>*/}
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.handleSubListEditClose}>Close</Button>
					</Modal.Footer>
          </Modal>

        {/*DELETE SUBLIST MODAL*/}
        <Modal show={this.state.showSubListDelModal} onHide={this.handleSubListDelClose}>
					<Modal.Header closeButton>
						<Modal.Title id="listModalTitle">{this.state.subListTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>Are you sure you would like to delete <strong>{this.state.subListTitle}</strong>?</h4>
					</Modal.Body>
					<Modal.Footer>
          <button onClick={() => this.removeSubList(this.state.subListId, this.state.subListTitle)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
						<Button onClick={this.handleSubListDelClose}>Close</Button>
					</Modal.Footer>
				</Modal>

        {/*DELETE LIST MODAL*/}
        <Modal show={this.state.showDelModal} onHide={this.handleDelClose}>
					<Modal.Header closeButton>
						<Modal.Title id="listModalTitle">{this.state.listTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>Are you sure you would like to delete <strong>{this.state.listTitle}</strong>?</h4>
					</Modal.Body>
					<Modal.Footer>
          <button onClick={() => this.removeList(this.state.listId, this.state.listTitle)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
						<Button onClick={this.handleDelClose}>Close</Button>
					</Modal.Footer>
				</Modal>

        {/*EDIT LIST MODAL*/}
        <Modal show={this.state.showEditModal} onHide={this.handleEditClose} data-dismiss="modal">
					<Modal.Header closeButton>
						<Modal.Title id="listModalTitle">{this.state.listTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
          <div id="addItemDiv">
          <h3 className="letterSpacing">Edit The List Name:</h3>
          {/*<form id="createListDiv" className="jumbotron" onSubmit={this.editList}>*/}

            <input id="submitText" type="text" name="listTitle" placeholder={this.state.listTitle} value={this.state.listTitle} onChange={this.handleChange} />
						<button id="submitBtn" onClick={() => {this.editList(this.state.listId, this.state.listTitle); this.setState({showEditModal: false});}} className="btn btn-success btn-sm">Submit</button>
          </div>
          {/*</form>*/}
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.handleEditClose} data-dismiss="modal">Close</Button>
					</Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default App;
