import Reflux from 'reflux';

var Actions = Reflux.createActions({
  "addItem": {},
  "removeItem": {},
  "startEditingItem": {},
  "cancelEditingItem": {},
  "editItem": {},
  "showMap": {},
  "closeMap": {},
  "loadMap": {asyncResult: true}
});

export default Actions;
