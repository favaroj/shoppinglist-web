
import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
//const { Pool, Client } = require('pg')
//const { pg } = require('pg-native')
//var pg = require('pg');
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
      showSavePrompt: false,
      showDelPrompt: false,

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
      itemTitle: '',

      mainListOrderIndex: 0,
      subListOrderIndex: 0,
      backgroundColor: '',
      foregroundColor: '',
      foreBtnColor: '',
      subListBackgroundColor: '',
      subListForegroundColor: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleItemSubmit = this.handleItemSubmit.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleDelShow = this.handleDelShow.bind(this);
    this.handleSavePrompt = this.handleSavePrompt.bind(this);

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

    this.addMainListOrderIndex = this.addMainListOrderIndex.bind(this);
    this.handleIndexIncrement = this.handleIndexIncrement.bind(this);
    this.handleIndexDecrement = this.handleIndexDecrement.bind(this);
    //this.sortArray = this.sortArray.bind(this);
  }

  componentDidMount() {

    const listRef = firebase.database().ref('Lists');
    listRef.on('value', (snapshot) => {
      let lists = snapshot.val();
      let newState = [];
      let childState = [];
      for (let list in lists) {
        if(typeof(lists[list].title) !== 'undefined') {
          listRef.child(list).orderByChild('orderIndex').on('value', (child) => {
            console.log(child.val());
            /*child.forEach(function(newChild) {
              console.log(newChild.val());
            });*/
            let count = child.numChildren();
            let adjCount = count - 1;
            newState.push({
              id: list,
              title: lists[list].title,
              count: adjCount,
              orderIndex: lists[list].orderIndex,
              backgroundColor: lists[list].backgroundColor,
              foregroundColor: lists[list].foregroundColor
            });
          })

        }
      };

      function sortArray(a, b) {
        const indexA = a.orderIndex;
        const indexB = b.orderIndex;
    
        let comparison = 0;
        if (indexA > indexB) {
          comparison = 1;
        } else if (indexA < indexB) {
          comparison = -1;
        }
        return comparison;
      };
      
  
      newState.sort(sortArray);
      
      this.setState({
        lists: newState
      });
    });

    /*const listRef = firebase.database().ref('Lists');
    listRef.on('value', (snapshot) => {
      let lists = snapshot.val();
      let newState = [];
      let childState = [];
      for (let list in lists) {
        if(typeof(lists[list].title) !== 'undefined') {
          listRef.child(list).orderByChild('orderIndex').on('value', (child) => {
            console.log(child.val());
            console.log(child.key);
          
            let count = child.numChildren();
            let adjCount = count - 1;
            newState.push({
              id: list,
              title: lists[list].title,
              count: adjCount,
              orderIndex: lists[list].orderIndex,
            });
            let subLists = child.val();
            let subListState = [];
            for (let subList in subLists) {
              if(typeof(subLists[subList].title) !== 'undefined') {
                listRef.child(list).child(subList).on('value', (child) => {
                  console.log(child.val());
                  console.log(child.key);
                  let items = child.val();
                  let count = child.numChildren();
                  let adjCount = count - 1;
                subListState.push({
                  id: subList,
                  title: subLists[subList].title,
                  count: adjCount
                });
                  let childState = [];
                  for (let item in items) {
                    if(typeof(items[item].title) !== 'undefined') {
                      listRef.child(list).child(subList).child(item).on('value', (child) => {
                        console.log(child.val());
                        console.log(child.key);
                        childState.push({
                          id: item,
                          title: items[item].title
                        });
                      });
                    }
                  }
                  this.setState({
                    items: childState
                  });
                });
              }
            }
            this.setState({
              subLists: subListState
            });
          });
          
          }
      };

      function sortArray(a, b) {
        const indexA = a.orderIndex;
        const indexB = b.orderIndex;
    
        let comparison = 0;
        if (indexA > indexB) {
          comparison = 1;
        } else if (indexA < indexB) {
          comparison = -1;
        }
        return comparison;
      };
      
  
      newState.sort(sortArray);
      
      this.setState({
        lists: newState
      });
    });*/
  }

  handleIndexIncrement() {
    var incrementedIndex = parseInt(this.state.mainListOrderIndex) + 1;
    this.setState({
      mainListOrderIndex: incrementedIndex
    });
  }

  handleIndexDecrement() {
    if(this.state.mainListOrderIndex > 1) {
      var decrementIndex = parseInt(this.state.mainListOrderIndex) - 1;
      this.setState({
        mainListOrderIndex: decrementIndex
      });
    } else {
      alert("Index cannot be 0!");
    }
  }

  addMainListOrderIndex(listId, mainListOrderIndex) {
    const listRef = firebase.database().ref(`/Lists/${listId}`);
    const orderIndex = {
      mainListOrderIndex: this.state.mainListOrderIndex
    }
    listRef.update({
      orderIndex: mainListOrderIndex
    });
  }

  editList(listId, listTitle, orderIndex, backgroundColor, foregroundColor) {
      const listRef = firebase.database().ref(`/Lists/${listId}`);
      const title = {
        title: this.state.listTitle,
      }
      listRef.update({
        title: listTitle,
        orderIndex: orderIndex,
        backgroundColor: backgroundColor,
        foregroundColor: foregroundColor
      });
      this.handleSavePrompt();
      //alert(listTitle + ' has been edited!');
      //this.handleEditClose();
  }

  editSubList(subListId, subListTitle) {
    const listRef = firebase.database().ref(`/Lists/${this.state.listId}/${subListId}`);
    listRef.update({
      title: this.state.subListTitle,
      orderIndex: this.state.subListOrderIndex,
      subListBackgroundColor: this.state.subListBackgroundColor,
      subListForegroundColor: this.state.subListForegroundColor
    });
    this.handleSavePrompt();
  }

  editItem(itemId, itemTitle) {
    //alert(itemId +':' +this.state.itemTitle);
    const listRef = firebase.database().ref(`/Lists/${this.state.listId}/${this.state.subListId}/${itemId}`);

    listRef.update({
      title: this.state.itemTitle
    });
    this.handleSavePrompt();
  }

  deleteItem(itemId, itemTitle) {
    const listRef = firebase.database().ref(`/Lists/${this.state.listId}/${this.state.subListId}/${itemId}`);
    listRef.remove();
    this.handleItemDelClose();
    this.handleItemEditClose();
  }

  removeList(listId, listTitle) {
      const listRef = firebase.database().ref(`/Lists/${listId}`);
      listRef.remove();
      //alert(listTitle + ' has been deleted!');
      this.handleDelClose();
      this.handleEditClose();
  }

  removeSubList(subListId, subListTitle) {
    const listRef = firebase.database().ref(`/Lists/${this.state.listId}/${subListId}`);
    listRef.remove();
    //alert(subListTitle + ' has been deleted!');
    this.handleSubListDelClose();
    this.handleSubListEditClose();
    
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

	handleEditShow(listId, listTitle, orderIndex, backgroundColor, foregroundColor) {
    this.setState({
      listTitle: listTitle,
      listId: listId,
      mainListOrderIndex: orderIndex,
      backgroundColor: backgroundColor,
      foregroundColor: foregroundColor
    });
		this.setState({ showEditModal: true });
  }

  handleSubListEditClose() {
    this.setState({ showSubListEditModal: false });
  }

  handleSubListEditShow(subListId, subListTitle, subListOrderIndex, subListBackgroundColor, subListForegroundColor) {
    this.setState({
      subListTitle: subListTitle,
      subListId: subListId,
      subListOrderIndex: subListOrderIndex,
      subListBackgroundColor: subListBackgroundColor,
      subListForegroundColor: subListForegroundColor
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
  handleIndexChange() {
    let incrementedIndex = this.state.mainListOrderIndex++;
    this.setState({
      mainListOrderIndex: incrementedIndex
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('Lists');
    let adjIndex = this.state.lists.length + 1;
    // Get a key for a new List.
    var newListKey = itemsRef.push().key;
    const item = {
      title: this.state.newListNameInput,
      orderIndex: adjIndex,
      backgroundColor: '#103D5D',
      foregroundColor: '#FFFFFF'
    }
    itemsRef.push(item).key;
    this.setState({
      newListNameInput: ''
    });
  }

  handleSubListIndexChange() {
    let incrementedIndex = this.state.subListOrderIndex++;
    this.setState({
      subListOrderIndex: incrementedIndex
    }); 
  }

  handleSubListIndexIncrement() {
    var incrementedIndex = parseInt(this.state.subListOrderIndex) + 1;
    this.setState({
      subListOrderIndex: incrementedIndex
    });
  }

  handleSubListIndexDecrement() {
    if(this.state.subListOrderIndex > 1) {
      var decrementIndex = parseInt(this.state.subListOrderIndex) - 1;
      this.setState({
        subListOrderIndex: decrementIndex
      });
    } else {
      alert("Index cannot be 0!");
    }
  }

  handleSubListSubmit(e) {
    console.log(this.state.listId);
    e.preventDefault();
    const itemsRef = firebase.database().ref(`Lists/${this.state.listId}`);
    var index = this.state.subLists.length + 1;
    const item = {
      title: this.state.newSubListNameInput,
      orderIndex: index,
      subListBackgroundColor: '#103D5D',
      subListForegroundColor: '#FFFFFF'
    }
    var newRef = itemsRef.push(item).key;
    /*itemsRef.child(newRef).push({
      title: 'Default Item'
    });*/
    this.setState({
      newSubListNameInput: ''
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

  handleSavePrompt() {
    this.setState({showSavePrompt: true});
    setTimeout(function() { this.setState({showSavePrompt: false}); }.bind(this), 2000);
 
    
  }

  showList(listId, listTitle, mainListOrderIndex, backgroundColor, foregroundColor) {
    const listRef = firebase.database().ref('Lists');
    listRef.child(listId).on('value', (snapshot) => {
        let subLists = snapshot.val();
        let subListState = [];
        for (let subList in subLists) {
          if(typeof(subLists[subList].title) !== 'undefined') {
            listRef.child(listId).child(subList).on('value', (child) => {
              let items = child.val();
              let count = child.numChildren();
              let adjCount = count - 4;
            subListState.push({
              id: subList,
              title: subLists[subList].title,
              count: adjCount,
              orderIndex: subLists[subList].orderIndex,
              subListBackgroundColor: subLists[subList].subListBackgroundColor,
              subListForegroundColor: subLists[subList].subListForegroundColor
            });
            let childState = [];
            /*for (let item in items) {
              if(typeof(items[item].title) !== 'undefined') {
                listRef.child(listId).child(subList).child(item).on('value', (child) => {
                  childState.push({
                    id: item,
                    title: items[item].title
                  });
                });
              }
            }
            this.setState({
              items: childState
            });*/
          });
          }
        }
        function sortArray(a, b) {
          const indexA = a.orderIndex;
          const indexB = b.orderIndex;
      
          let comparison = 0;
          if (indexA > indexB) {
            comparison = 1;
          } else if (indexA < indexB) {
            comparison = -1;
          }
          return comparison;
        };
        
    
        subListState.sort(sortArray);
        
        this.setState({
          subLists: subListState
        });
        
    });
    this.setState({
      listTitle: listTitle,
      listId: listId,
      mainListOrderIndex: mainListOrderIndex,
      backgroundColor: backgroundColor,
      foregroundColor: foregroundColor
    });
    this.setState({
      showListModal: true
    });
  }

  showItems(subListId, subListTitle, subListOrderIndex, subListBackgroundColor, subListForegroundColor) {
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
      subListId: subListId,
      subListOrderIndex: subListOrderIndex,
      subListBackgroundColor: subListBackgroundColor,
      subListForegroundColor: subListForegroundColor
    });
    this.setState({
      showSubListModal: !this.state.showSubListModal
    });
  }

  handleChangeComplete(color) {
    this.setState({
      backgroundColor: color.hex
    })
  }

  handleForegroundChange(color) {
    this.setState({
      foregroundColor: color.hex
    });
  }

  setBackgroundState() {
    this.setState({
      showBackgroundEdit: !this.state.showBackgroundEdit
    })
  }

  setForegroundState() {
    this.setState({
      showForegroundEdit: !this.state.showForegroundEdit,
      foreBtnColor: 'green'
    })
  }

  handleSublistBackgroundChange(color) {
    this.setState({
      subListBackgroundColor: color.hex
    })
  }

  handleSublistForegroundChange(color) {
    this.setState({
      subListForegroundColor: color.hex
    });
  }

  setSublistBackgroundState() {
    this.setState({
      showSublistBackgroundEdit: !this.state.showSublistBackgroundEdit
    })
  }

  setSublistForegroundState() {
    this.setState({
      showSublistForegroundEdit: !this.state.showSublistForegroundEdit
    })
  }

  handleBackgroundClick() {
    /*var that = this;
      $.ajax({
        url:this.setListStates(listId, listName, orderIndex),
        success:function() {
          that.showBackgroundEdit();
        }
      });*/
  }

  showBackgroundEdit() {

  }

  render() {
    return (
      <div id='App' className='container-fluid'>
      <header style={{padding: 0}}>
        <div className='wrapper'>
          <img src="shoppingCart-image.png" className="App-logo" alt="logo"/>
          <h1 style={{marginBottom: 0}}>List Portal<hr className="hrFormat"/></h1>
        </div>
      </header>
      <div>
      <form ref="mainListForm" id="createListDiv" className="addItemDiv">
        {/*<h3 className="letterSpacing">Create List</h3>*/}
        <div id="addItemContainer">
          
          <input ref="listName" id="submitText" type="text" name="newListNameInput" placeholder="New List" value={this.state.newListNameInput} onChange={this.handleChange.bind(this)}/>
          <a style={{color: 'darkslategrey'}} onClick={this.handleSubmit.bind(this)}><i style={{color: '#4A96AD'}}className="fas fa-plus fa-3x"></i></a>
        </div>
      </form>
      </div>
      <hr className="hrFormat" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '30px'}}/>
      <section className="jumbotron" id="mainListSection">
        <div className="wrapper">

        <h2 className="letterSpacing">Current Lists</h2>
        <hr className="hrFormat" style={{borderColor: '#343a40', marginLeft: '10px', marginRight: '10px'}}/>
        <ul id="mainList">
          {this.state.lists.map((list) => {
            return (
              <li className="mainItems" key={list.id}>
              <div id="mainListBtnContainer">
              {/*set backgroundColor to list.backgroundColor stored in DB on edit save*/}
                <div id="listBtns" style={{backgroundColor:list.backgroundColor}}>
                  <a onClick={() => this.handleEditShow(list.id, list.title, list.orderIndex, list.backgroundColor, list.foregroundColor)} id="editMainListBtn" ><i id="editIcon" className="fas fa-edit fa-sm"></i></a>
                  <a id="mainListBtn"  onClick={this.showList.bind(this, list.id, list.title, list.orderIndex, list.backgroundColor, list.foregroundColor)}><div style={{color:list.foregroundColor}}>{list.title}</div></a>{/*<div> {list.count > 0 && <p style={{  color:'red' }}>{list.count} List(s)</p>} {list.count == 0 && <p style={{  color:'green' }}>{list.count} List(s)</p>}</div>*/}
                  {/*<button onClick={() => this.handleEditShow(list.id, list.title, list.orderIndex)} id="editDelBtn" className="btn btn-success btn-sm">Edit</button><button onClick={() => this.handleDelShow(list.id, list.title)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>*/}
                </div>
              </div>
              </li>
            )
          })}
        </ul>
        </div>
      </section>

        {/*SHOW LIST MODAL*/}
        <Modal show={this.state.showListModal} onHide={this.handleListClose.bind(this)}>
					<Modal.Header>
            <a id="closeEditBtn" onClick={this.handleListClose.bind(this)}><i className="fas fa-times fa-2x"></i></a>
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 0}} >
              {/*<a style={{fontSize: '18!important'}}><i className="far fa-caret-square-down fa-2x"></i></a>*/}
              <Modal.Title id="listModalTitle">{this.state.listTitle}</Modal.Title>
              <a onClick={this.handleEditShow.bind(this, this.state.listId, this.state.listTitle, this.state.mainListOrderIndex, this.state.backgroundColor, this.state.foregroundColor)} id="editMainListBtn" ><i id="editIcon" className="fas fa-edit fa-2x"></i></a>
            </div>
          </Modal.Header>
					<Modal.Body style={{backgroundColor: '#4A96AD'}}>
          <form ref="subListForm" id="createListDiv" className="addItemDiv" style={{marginTop: 0, marginBottom: 10}}>
            {/*<h3 className="letterSpacing">Add List</h3>*/}
            <div id="addItemContainer">
              <input ref="subListName" id="submitText" style={{padding: 0}} type="text" name="newSubListNameInput" placeholder="New Sub-List" value={this.state.newSubListNameInput} onChange={this.handleChange.bind(this)}/>
              <a style={{color: 'darkslategrey'}} onClick={this.handleSubListSubmit.bind(this)}><i className="fas fa-plus fa-3x"></i></a>
            </div>
          </form>
          <div style={{borderBottom: 'solid 1px', marginBottom: 20, color: 'black'}}></div>
          <ol id="subList">
            {this.state.subLists.map((subList) => {
              return (
                <div>
                <li id="mainItems" key={subList.id}>
                <div id="mainListBtnContainer">
              
                <div id="listBtns" style={{backgroundColor:subList.subListBackgroundColor, marginBottom: 25, padding: 8}}>
                  <a onClick={this.handleSubListEditShow.bind(this, subList.id, subList.title, subList.orderIndex, subList.subListBackgroundColor, subList.subListForegroundColor)} id="editDelBtn" style={{float: 'right'}}><i id="editIcon" className="fas fa-edit"></i></a>
                  <a id="mainListBtn" onClick={this.showItems.bind(this, subList.id, subList.title, subList.orderIndex, subList.subListBackgroundColor, subList.subListForegroundColor)}><div style={{color:subList.subListForegroundColor}}>{subList.title} <p style={{color:subList.subListForegroundColor, fontSize: 16}} >{subList.count} Item(s)</p></div></a>
                  {/*style={{color: 'grey', fontSize: 16}}*/}
                </div>
                </div>
                  
                </li>
                
                
                {/*<div>
                { this.state.showSubListModal ? 
                  <div>
                  
                  <form id="addItemDiv" className="jumbotron" onSubmit={this.handleItemSubmit}>
                  <h3 className="letterSpacing">Add Item</h3>
                  <input id="addItemText" type="text" name="itemName" placeholder="New Item" value={this.state.itemName} onChange={this.handleChange}/>
                  <button id="submitBtn" className="btn btn-success btn-sm btn-block">Add</button>
                </form>
                  <ol id="itemsList">
                    {this.state.items.map((item) => {
                      return (
                        <li id="items" key={item.id}>
                          <div><p>{item.title}<a onClick={() => this.handleItemEditShow(item.id, item.title)} id="editDelBtn" ><i id="editIcon" className="fas fa-edit"></i></a><a onClick={() => this.handleItemDelShow(item.id, item.title)} id="editDelBtn"><i id="delIcon" className="fas fa-trash-alt"></i></a></p></div>
                        </li>
                      )
                    })}
                  </ol>
                  
                    <Button onClick={this.handleSubListClose}>Close</Button>
                 
                </div>
              
              
                : null }
                </div>*/}
                  </div>
              )
            })}
            
          </ol>
					</Modal.Body>
					<Modal.Footer style={{backgroundColor: '#4A96AD'}}>
						<Button onClick={this.handleListClose.bind(this)}>Close</Button>
					</Modal.Footer>
        </Modal>
        

        {/*SHOW SUBLIST MODAL*/}
        <Modal show={this.state.showSubListModal} onHide={this.handleSubListClose}>
					<Modal.Header>
          <a id="closeEditBtn" onClick={this.handleSubListClose}><i className="fas fa-times fa-2x"></i></a>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 0}}>
            <Modal.Title id="listModalTitle">{this.state.subListTitle}</Modal.Title>
            <a onClick={this.handleSubListEditShow.bind(this, this.state.subListId, this.state.subListTitle, this.state.subListOrderIndex, this.state.subListBackgroundColor, this.state.subListForegroundColor)} id="editDelBtn" style={{float: 'right'}}><i id="editIcon" className="fas fa-edit fa-2x"></i></a>
            </div>
						
					</Modal.Header>
					<Modal.Body style={{backgroundColor: '#4A96AD'}}>
          <form id="createListDiv" className="addItemDiv" style={{marginTop: 0, marginBottom: 10}} onSubmit={this.handleItemSubmit}>
          <div id="addItemContainer">
          <input id="submitText" type="text" name="itemName" placeholder="New Item" value={this.state.itemName} onChange={this.handleChange}/>
          <a style={{color: 'darkslategrey'}} onClick={this.handleItemSubmit}><i className="fas fa-plus fa-3x"></i></a>
            </div>
        </form>
        <div style={{borderBottom: 'solid 1px', marginBottom: 20, color: 'black'}}></div>
          <ol id="itemsList">
            {this.state.items.map((item) => {
              return (
                <li id="items" key={item.id}>
                  <div><p style={{marginBottom: 0}}>{item.title}<a id="editDelBtn" onClick={() => this.handleItemDelShow(item.id, item.title)} style={{float: 'right', marginLeft: 20}}><i id="delIcon" className="fas fa-trash-alt"></i></a><a onClick={() => this.handleItemEditShow(item.id, item.title)} id="editDelBtn" style={{float: 'right'}}><i id="editIcon" className="fas fa-edit"></i></a></p></div>
                </li>
              )
            })}
          </ol>
					</Modal.Body>
					<Modal.Footer style={{backgroundColor: '#4A96AD'}}>
						<Button onClick={this.handleSubListClose}>Close</Button>
					</Modal.Footer>
				</Modal>
        
        {/*DELETE ITEM MODAL*/}
        <Modal show={this.state.showItemDelModal} onHide={this.handleItemDelClose}>
					<Modal.Header>
          <a id="closeEditBtn" onClick={this.handleItemDelClose}><i className="fas fa-times fa-2x"></i></a>
						<Modal.Title id="listModalTitle">Delete</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4 style={{textAlign: 'center'}}>Delete <strong>{this.state.itemTitle}?</strong></h4>
					</Modal.Body>
					<Modal.Footer>
          <button onClick={() => this.deleteItem(this.state.itemId, this.state.itemTitle)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
						<Button onClick={this.handleItemDelClose}>Close</Button>
					</Modal.Footer>
				</Modal>

        {/*EDIT ITEM MODAL*/}
        {/*<Modal show={this.state.showItemEditModal} onHide={this.handleItemEditClose}>
					<Modal.Header>
          <a id="closeEditBtn" onClick={this.handleItemEditClose}><i className="fas fa-times fa-2x"></i></a>
          <a onClick={() => this.handleItemDelShow(this.state.itemId, this.state.itemTitle)} id="editDelBtn"><i id="delIcon" className="fas fa-trash-alt fa-2x"></i></a>
						<Modal.Title id="listModalTitle">{this.state.itemTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
          
          <div id="addItemDiv">
          <h3 className="letterSpacing">Edit Item</h3>
          <input id="addItemText" type="text" name="itemTitle" placeholder={this.state.itemTitle} value={this.state.itemTitle} onChange={this.handleChange}/>
          <button id="submitBtn" onClick={() => {this.editItem(this.state.itemId, this.state.idTitle); this.setState({showItemEditModal: false});}} className="btn btn-success btn-sm btn-block" data-dismiss="modal">Submit</button>
          </div>
  
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.handleItemEditClose}>Close</Button>
					</Modal.Footer>
          </Modal>*/}


        <Modal show={this.state.showItemEditModal} onHide={this.handleItemEditClose} >
          <Modal.Header>
            <a id="closeEditBtn" onClick={this.handleItemEditClose}><i className="fas fa-times fa-2x"></i></a>
            <a id="editDelBtn" onClick={() => this.handleItemDelShow(this.state.itemId, this.state.itemTitle)}><i id="delIcon" className="fas fa-trash-alt fa-2x"></i></a>
						{/*<Modal.Title id="listModalTitle">Edit</Modal.Title>*/}
          </Modal.Header>
					<Modal.Body id="editModalBody">
          <Modal.Title id="listModalTitle">Edit</Modal.Title>
          <div id="addItemDiv">
            {/*<form id="createListDiv" className="jumbotron" onSubmit={this.editList}>*/}
              <div id="editNameContainer">
                <h3 id="editNameLabel">Name:</h3>
                <input id="submitText" type="text" name="itemTitle" placeholder={this.state.itemTitle} value={this.state.itemTitle} onChange={this.handleChange}/>
              </div>
              {/*<button id="submitBtn" onClick={() => {this.editList(this.state.listId, this.state.listTitle); this.setState({showEditModal: false});}} className="btn btn-success btn-sm">Submit</button>*/}
          </div>
         {/*<div id="addItemDiv">
          <h4 id="indexOrderHeader">Order</h4>
            <div id="editNameContainer">
              <h3 id="editNameLabel" style={{paddingLeft: 5}}>Index:</h3>
              <input id="submitText" className="indexInputFormat" type="text" name="subListOrderIndex" placeholder="1" value={this.state.subListOrderIndex} onChange={this.handleSubListIndexChange.bind(this)} />
              
              <div id="indexAdjustContainer">
                <a onClick={this.handleSubListIndexIncrement.bind(this)}><i className="fas fa-angle-up fa-3x"></i></a>
                <a onClick={this.handleSubListIndexDecrement.bind(this)}><i className="fas fa-angle-down fa-3x"></i></a>
              </div>
            </div>
        </div>*/}
          {/*</form>*/}
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.handleItemEditClose} data-dismiss="modal">Cancel</Button>
            <Button onClick={() => {this.editItem(this.state.itemId, this.state.itemTitle); this.setState({showItemEditModal: false});}} data-dismiss="modal">Save</Button>
					</Modal.Footer>
          </Modal>




        {/*EDIT SUBLIST MODAL*/}
        {/*<Modal id="modalFormat" show={this.state.showSubListEditModal} onHide={this.handleSubListEditClose}>
					<Modal.Header closeButton>
						<Modal.Title id="listModalTitle">{this.state.subListTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
          <div id="addItemDiv">
          <h3 className="letterSpacing">Edit The List Name:</h3>
  

            <input id="submitItem" type="text" name="subListTitle" placeholder={this.state.subListTitle} value={this.state.subListTitle} onChange={this.handleChange} />
						<button id="submitBtn" onClick={() => {this.editSubList(this.state.subListId, this.state.subListTitle); this.setState({showSubListEditModal: false});}} className="btn btn-success btn-sm">Submit</button>
          </div>

					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.handleSubListEditClose}>Close</Button>
					</Modal.Footer>
        </Modal>*/}

          <Modal show={this.state.showSubListEditModal} onHide={this.handleSubListEditClose} >
          <Modal.Header>
            <a id="closeEditBtn" onClick={this.handleSubListEditClose}><i className="fas fa-times fa-2x"></i></a>
            <a id="editDelBtn" onClick={() => this.handleSubListDelShow(this.state.subListId, this.state.subListTitle)}><i id="delIcon" className="fas fa-trash-alt fa-2x"></i></a>
						{/*<Modal.Title id="listModalTitle">Edit</Modal.Title>*/}
          </Modal.Header>
					<Modal.Body id="editModalBody">
          <Modal.Title id="listModalTitle">Edit</Modal.Title>
          <div id="addItemDiv">
            {/*<form id="createListDiv" className="jumbotron" onSubmit={this.editList}>*/}
              <div id="editNameContainer">
                <h3 id="editNameLabel">Name:</h3>
                <input id="submitText" type="text" name="subListTitle" placeholder={this.state.subListTitle} value={this.state.subListTitle} onChange={this.handleChange} />
              </div>
              {/*<button id="submitBtn" onClick={() => {this.editList(this.state.listId, this.state.listTitle); this.setState({showEditModal: false});}} className="btn btn-success btn-sm">Submit</button>*/}
          </div>
          <div id="addItemDiv">
          <h4 id="indexOrderHeader">Order</h4>
            <div id="editNameContainer">
              <h3 id="editNameLabel" style={{paddingLeft: 5}}>Index:</h3>
              <input id="submitText" className="indexInputFormat" type="text" name="subListOrderIndex" placeholder="1" value={this.state.subListOrderIndex} onChange={this.handleSubListIndexChange.bind(this)} />
              {/*<div id="orderIndexBtnDiv"><button id="submitOrderIndexBtn" onClick={() => {this.addMainListOrderIndex(this.state.listId, this.state.mainListOrderIndex)}} className="">Add Index</button></div>*/}
              <div id="indexAdjustContainer">
                <a onClick={this.handleSubListIndexDecrement.bind(this)}><i className="fas fa-angle-up fa-3x"></i></a>
                <a onClick={this.handleSubListIndexIncrement.bind(this)}><i className="fas fa-angle-down fa-3x"></i></a>
              </div>
            </div>
          </div>
          <div id="subListBackForeEditContainer">
              <div id="backForeEditBtn"><button className="colorPickerBtns" onClick={this.setSublistBackgroundState.bind(this)} style={this.state.showSublistBackgroundEdit ?  {backgroundColor: 'green'} : null}>Background Color</button>
              <button id="foreBtn" className="colorPickerBtns" onClick={this.setSublistForegroundState.bind(this)} style={this.state.showSublistForegroundEdit ?  {backgroundColor: 'green'} : null}>Foreground Color</button>
              {this.state.showSublistBackgroundEdit ? <SketchPicker className="colorPicker" color={this.state.subListBackgroundColor} onChangeComplete={this.handleSublistBackgroundChange.bind(this)}/> : null
              }
              
              {this.state.showSublistForegroundEdit ? <SketchPicker className="colorPicker" color={this.state.subListForegroundColor} onChangeComplete={this.handleSublistForegroundChange.bind(this)}/> : null
              }
              </div>
          </div>
          {/*</form>*/}
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.handleSubListEditClose.bind(this)} data-dismiss="modal">Cancel</Button>
            <Button onClick={() => {this.editSubList(this.state.subListId, this.state.subListTitle, this.state.subListOrderIndex, this.state.subListBackgroundColor, this.state.subListForegroundColor); this.setState({showSubListEditModal: false});}} data-dismiss="modal">Save</Button>
					</Modal.Footer>
          </Modal>

        {/*DELETE SUBLIST MODAL*/}
        <Modal show={this.state.showSubListDelModal} onHide={this.handleSubListDelClose}>
					<Modal.Header>
          <a id="closeEditBtn" onClick={this.handleSubListDelClose}><i className="fas fa-times fa-2x"></i></a>
						<Modal.Title id="listModalTitle">{this.state.subListTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4 style={{textAlign: 'center'}}>Delete <strong>{this.state.subListTitle}</strong>?</h4>
					</Modal.Body>
					<Modal.Footer>
          <button onClick={() => this.removeSubList(this.state.subListId, this.state.subListTitle)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
						<Button onClick={this.handleSubListDelClose}>Close</Button>
					</Modal.Footer>
				</Modal>

        {/*DELETE LIST MODAL*/}
        <Modal show={this.state.showDelModal} onHide={this.handleDelClose}>
					<Modal.Header>
          <a id="closeEditBtn" onClick={this.handleDelClose}><i className="fas fa-times fa-2x"></i></a>
						<Modal.Title id="listModalTitle">{this.state.listTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4 style={{textAlign: 'center'}}>Delete <strong>{this.state.listTitle}</strong>?</h4>
					</Modal.Body>
					<Modal.Footer>
          <button onClick={() => this.removeList(this.state.listId, this.state.listTitle)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
						<Button onClick={this.handleDelClose}>Close</Button>
					</Modal.Footer>
				</Modal>

        {/*SAVE PROMPT MODAL*/}
        <Modal show={this.state.showSavePrompt} data-dismiss="modal" id="editSavePrompt">
        <div>
            <p id="editSaveText">Edits Saved!</p>
        </div>
        </Modal>

        {/*DELETE LIST PROMPT MODAL*/}
        <Modal show={this.state.showDelPrompt} data-dismiss="modal" id="editSavePrompt">
        <div>
            <p id="editSaveText">{this.state.listname} Deleted!</p>
        </div>
        </Modal>

        {/*EDIT LIST MODAL*/}
        <Modal show={this.state.showEditModal} onHide={this.handleEditClose} data-dismiss="modal" animationtype="fade">
          <Modal.Header>
            <a id="closeEditBtn" onClick={this.handleEditClose}><i className="fas fa-times fa-2x"></i></a>
            <a id="editDelBtn" onClick={() => this.handleDelShow(this.state.listId, this.state.listTitle)}><i id="delIcon" className="fas fa-trash-alt fa-2x"></i></a>
						{/*<Modal.Title id="listModalTitle">Edit</Modal.Title>*/}
          </Modal.Header>
					<Modal.Body>
          <Modal.Title id="listModalTitle">Edit</Modal.Title>
          <div id="addItemDiv">
            {/*<form id="createListDiv" className="jumbotron" onSubmit={this.editList}>*/}
              <div id="editNameContainer">
                <h3 id="editNameLabel">Name:</h3>
                <input id="submitText" type="text" name="listTitle" placeholder={this.state.listTitle} value={this.state.listTitle} onChange={this.handleChange} />
              </div>
              {/*<button id="submitBtn" onClick={() => {this.editList(this.state.listId, this.state.listTitle); this.setState({showEditModal: false});}} className="btn btn-success btn-sm">Submit</button>*/}
          </div>
          <div id="addItemDiv">
          <h4 id="indexOrderHeader">Order</h4>
            <div id="editNameContainer">
              <h3 id="editNameLabel" style={{paddingLeft: 5}}>Index:</h3>
              <input id="submitText" className="indexInputFormat" type="text" name="mainListOrderIndex" placeholder="1" value={this.state.mainListOrderIndex} onChange={this.handleIndexChange} />
              {/*<div id="orderIndexBtnDiv"><button id="submitOrderIndexBtn" onClick={() => {this.addMainListOrderIndex(this.state.listId, this.state.mainListOrderIndex)}} className="">Add Index</button></div>*/}
              <div id="indexAdjustContainer">
                <a onClick={this.handleIndexDecrement}><i className="fas fa-angle-up fa-3x"></i></a>
                <a onClick={this.handleIndexIncrement}><i className="fas fa-angle-down fa-3x"></i></a>
              </div>
            </div>
          
          </div>
          <div id="backForeEditContainer">
              <div id="backForeEditBtn"><button className="colorPickerBtns" onClick={this.setBackgroundState.bind(this)} style={this.state.showBackgroundEdit ?  {backgroundColor: 'green'} : null}>Background Color</button>
              <button id="foreBtn" className="colorPickerBtns" onClick={this.setForegroundState.bind(this)} style={this.state.showForegroundEdit ?  {backgroundColor: 'green'} : null}>Foreground Color</button>
              {this.state.showBackgroundEdit ? <SketchPicker className="colorPicker" color={this.state.backgroundColor} onChangeComplete={this.handleChangeComplete.bind(this)}/> : null
              }
              
              {this.state.showForegroundEdit ? <SketchPicker className="colorPicker" color={this.state.foregroundColor} onChangeComplete={this.handleForegroundChange.bind(this)}/> : null
              }
              </div>
          </div>
          {/*</form>*/}
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.handleEditClose.bind(this)} data-dismiss="modal">Cancel</Button>
            <Button onClick={() => {this.editList(this.state.listId, this.state.listTitle, this.state.mainListOrderIndex, this.state.backgroundColor, this.state.foregroundColor); this.setState({showEditModal: false});}} data-dismiss="modal">Save</Button>
					</Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default App;
