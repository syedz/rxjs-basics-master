import '../styles.css';
console.clear();

// begin lesson code
// import { ObservableStore } from './store';

import { BehaviorSubject, Subject } from 'rxjs';
import { map, distinctUntilKeyChanged, scan } from 'rxjs/operators';

class ObservableStore {  
    constructor(initialState) {
      this._store = new BehaviorSubject(initialState);

      this._stateUpdate = new Subject();
      this._stateUpdate.pipe(
        /*
         * Accumulate state over time using scan.
         * For this example we will just merge our current state
         * with updated state and emit the result, however
         * this could be any reducer / pattern you wish to follow.
         */
        scan((current, updated) => {
          return { ...current, ...updated }
        }, initialState)
      ).subscribe(this._store);
    }
  
    /*
     * Select a slice of state based on key.
     */
    selectState(key) {
      return this._store.pipe(
        distinctUntilKeyChanged(key),
        map(state => state[key])
      );
    }
  
    /*
     * Update state with new object to merge.
     */
    updateState(newState) {
      this._stateUpdate.next(newState);
    }
  
    /*
     * Subscribe to any store state changes.
     */
    stateChanges() {
      return this._store.asObservable();
    }
}

const store = new ObservableStore({
  user: 'joe',
  isAuthenticated: true
});

/*
 * Select a slice of state from store.
 */
store.selectState('user').subscribe(console.log);

/*
 * Update a property with new value.
 */
store.updateState({
  user: 'bob'
});

store.updateState({
  isAuthenticated: true
});

/*
 * Selected state above (user) only emits when value has changed
 * for the requested property.
 */
store.updateState({
  isAuthenticated: false
});
