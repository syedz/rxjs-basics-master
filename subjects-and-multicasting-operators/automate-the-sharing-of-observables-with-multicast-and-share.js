import '../styles.css';
console.clear();
// begin lesson code

import { Subject, interval } from 'rxjs';
import { tap, multicast, refCount, share } from 'rxjs/operators';

const observer = {
  next: val => console.log('next', val),
  error: err => console.log('error', err),
  complete: () => console.log('complete')
};

const interval$ = interval(2000).pipe(
  tap(i => console.log('new interval', i))
);

// const multicastedInterval$ = interval$.pipe(
//   /*
//    * The multicast operator will subscribe the Subject you return
//    * to the underlying observable when connect() is called.
//    * This can be any flavor of Subject, for instance you can also
//    * multicast with a Behavior or ReplaySubject instead should
//    * the need arise.
//    */
//   multicast(() => new Subject())
// );

/*
 * Multicast returns a 'ConnectableObservable', meaning you need
 * to call the connect method to tell it when to subscribe the 
 * subject to the source. Without calling connect no values will be
 * emitted. connect() returns a subscription you can use to then
 * unsubscribe when needed.
 */
// @ts-ignore
// const connectedSub = multicastedInterval$.connect();

// const subOne = multicastedInterval$.subscribe(observer);
// const subTwo = multicastedInterval$.subscribe(observer);

// // unsubscribe after 3 seconds
// setTimeout(() => {
//   connectedSub.unsubscribe();
// }, 3000);

// const multicastedInterval$ = interval$.pipe(
//   multicast(() => new Subject()),
//   /*
//    * Instead of explicitly calling connect(), you can instead use the
//    * refCount operator. refCount will automatically connect the Subject
//    * to the source for you when the first subscriber arrives, and disconnect
//    * when the subscriber count hits zero.
//    */
//   refCount()
// );

// const subOne = multicastedInterval$.subscribe(observer);
// const subTwo = multicastedInterval$.subscribe(observer);

// // unsubscribe after 3 seconds
// setTimeout(() => {
//   subOne.unsubscribe();
//   subTwo.unsubscribe();
// }, 3000);

const multicastedInterval$ = interval$.pipe(
  /*
   * We can actually optimize this example even further. Because multicasting
   * with a refCount is so common, RxJS offers an operator that
   * does both of these things for us, the share operator. This let's us replace 
   * multicast and refCount with share for the same behavior.
   */
  share()
);

const subOne = multicastedInterval$.subscribe(observer);
const subTwo = multicastedInterval$.subscribe(observer);

// unsubscribe after 3 seconds
setTimeout(() => {
  subOne.unsubscribe();
  subTwo.unsubscribe();
}, 3000);