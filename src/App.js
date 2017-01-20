import React, { Component } from 'react';
import { Map, Marker } from 'yandex-map-react';
import ReactModal from 'react-modal';
import Reflux from 'reflux';
import Actions from "./actions.js"
import Store from './store.js';
import logo from './logo.svg';
import './App.css';

class MapModal extends Reflux.Component {
  constructor (props)
  {
    super(props);
    this.store = Store;
  }

  handleCloseModal() {
    Actions.closeMap();
  }

  renderMap() {
    if (this.state.isLoadedMap) {
      if (this.state.isMapError) {
        return <div>Ошибка</div>
      }
      else {
        return(
          <Map center={this.state.mapPoint} zoom={10}>
            <Marker lat={this.state.mapPoint[0]} lon={this.state.mapPoint[1]} />
          </Map>
        )
      }
    }
    else {
      return <div>Загрузка карты...</div>
    }
  }

  render() {
    return (
      <ReactModal isOpen={this.state.showMap} contentLabel="Карта">
        <button onClick={this.handleCloseModal}>Закрыть</button>
        {this.renderMap()}
      </ReactModal>
    )
  }
}

class ItemForm extends Reflux.Component {
  constructor (props)
  {
    super(props);
    this.store = Store;
    this.state = {showForm: false,
                  item: {
                    name: "",
                    description: "",
                    address: ""
                  }}
  }

  createItem(e) {
    e.preventDefault();
    Actions.addItem(this.state.item)
    this.setState({
      showForm: false,
      item: {
        name: "",
        description: "",
        address: ""
      }});
  }

  onFormChange(data) {
    this.setState(Object.assign(this.state.item, data))
  }

  render() {
    if (this.state.showForm ) {
      return (
        <form onSubmit={this.createItem.bind(this)}>
          <input
            type="text"
            placeholder="Название"
            value={this.state.item.name}
            onChange={(e) => this.onFormChange({name: e.target.value})}/>
          <input
            type="text"
            placeholder="Описание"
            value={this.state.item.description}
            onChange={(e) => this.onFormChange({description: e.target.value})}/>
          <input
            type="text"
            placeholder="Адрес"
            value={this.state.item.address}
            onChange={(e) => this.onFormChange({address: e.target.value})}/>
          <input type="submit" value="Добавить"/>
        </form>
      )
    }
    else {
      return (
        <button onClick={() => this.setState({showForm: true})}>Добавить</button>
      )
    }
  }
}

class Item extends Component {
  removeItem() {
    Actions.removeItem(this.props.id);
  }

  startEditingItem() {
    Actions.startEditingItem(this.props.id);
  }

  editItem() {

    let data = {
      name: this.refs.name.value,
      description: this.refs.description.value,
      address: this.refs.address.value
    }

    Actions.editItem(this.props.id, data);
  }

  cancelEditingItem() {
    Actions.cancelEditingItem(this.props.id);
  }

  showMap() {
    Actions.showMap(this.props.id);
  }

  renderValue(valueName) {
    if (this.props.isEditing) {
      return(
        <input type="text" ref={valueName} defaultValue={this.props[valueName]}/>
      );
    }
    else {
      return(
        <span>{this.props[valueName]}</span>
      );
    }
  }

  renderButtons() {
    if (this.props.isEditing) {
      return(
        <div>
          <button onClick={this.editItem.bind(this)}>Сохранить</button>
          <button onClick={this.cancelEditingItem.bind(this)}>Отмена</button>
        </div>
      )
    }
    else {
      return(
        <div>
          <button onClick={this.startEditingItem.bind(this)}>Редактировать</button>
          <button onClick={this.removeItem.bind(this)}>Удалить</button>
          <button onClick={this.showMap.bind(this)}>Карта</button>
        </div>
      )
    }
  }

  render () {
    return (
      <li>
        <div>
          <span>Название:</span>
          {this.renderValue("name")}
        </div>
        <div>
          <span>Описание:</span>
          {this.renderValue("description")}
        </div>
        <div>
          <span>Адрес:</span>
          {this.renderValue("address")}
        </div>
        {this.renderButtons()}
      </li>
    )
  }
}

class App extends Reflux.Component {
  constructor (props)
  {
    super(props);
    this.store = Store;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Задание</h2>
        </div>
        <ItemForm/>
        <ul>
          { this.state.items.map(function(item){
              return (
                <Item
                  name={item.name}
                  description={item.description}
                  address={item.address}
                  id={item.id}
                  isEditing={item.isEditing}
                  key={item.id}/>
              );
            })}
        </ul>
        <MapModal/>
      </div>
    );
  }
}

export default App;
