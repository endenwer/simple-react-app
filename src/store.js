import Reflux from 'reflux';
import Actions from './actions.js';
import {find, filter} from 'lodash';
import axios from 'axios';

class Store extends Reflux.Store {
  constructor() {
    super();
    this.listenables = Actions;
    this.state = {items: [], mapPoint: []};
    this.itemCounter = 0;
  }

  onAddItem(data) {
    this.updateItemsList([{
      id: this.itemCounter++,
      name: data.name,
      description: data.description,
      address: data.address
    }].concat(this.state.items));
  }

  onRemoveItem(id) {
    this.updateItemsList(filter(this.state.items, function(item){
      return item.id !== id;
    }));
  }

  startEditingItem(id) {
    let item = this.getItemById(id);
    if (item) {
      item.isEditing = true;
      this.updateItemsList(this.state.items);
    }
  }

  cancelEditingItem(id) {
    let item = this.getItemById(id);
    if (item) {
      item.isEditing = false;
      this.updateItemsList(this.state.items);
    }
  }

  onEditItem(id, data) {
    let item = this.getItemById(id);
    if (item) {
      item = Object.assign(item, data);
      item.isEditing = false;
      this.updateItemsList(this.state.items);
    }
  }

  onShowMap(id) {
    this.setState({showMap: true});
    Actions.loadMap(id);
  }

  onCloseMap() {
    this.setState({showMap: false, isMapError: false, isLoadedMap: false});
  }

  onLoadMap(id) {
    let item = this.getItemById(id);
    axios.get("https://geocode-maps.yandex.ru/1.x/", {
      params: {
        format: "json",
        geocode: item.address
      }
    })
         .then(Actions.loadMap.completed)
         .catch(Actions.loadMap.failed);
  }

  onLoadMapCompleted(response) {
    let geoObject = response.data.response.GeoObjectCollection.featureMember[0];

    if (geoObject) {
      let point = geoObject.GeoObject.Point.pos.split(" ").reverse().map(
        function(point){ return parseFloat(point); }
      );
      this.setState({isLoadedMap: true, mapPoint: point});
    }
    else {
      this.setState({isLoadedMap: true, isMapError: true});
    }
  }

  onLoadMapFsiled() {
    this.setState({isLoadedMap: true, isMapError: true});
  }

  getItemById(id) {
    return find(this.state.items, function(item) {
      return item.id === id;
    });
  }

  updateItemsList(items) {
    localStorage.setItem("items", JSON.stringify(items));
    this.setState({items: items});
  }
}

export default Store;
