import firebase from 'firebase'


const config = {
    apiKey: "AIzaSyAGwqziE1aB7oxkAeGAT8EIxRUol6O_fO0",
    authDomain: "shoppinglist-c4690.firebaseapp.com",
    databaseURL: "https://shoppinglist-c4690.firebaseio.com",
    projectId: "shoppinglist-c4690",
    storageBucket: "shoppinglist-c4690.appspot.com",
    messagingSenderId: "665003354084"
};
firebase.initializeApp(config);


export default firebase;