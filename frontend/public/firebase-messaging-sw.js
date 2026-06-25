importScripts(
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);

importScripts(
"https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);



firebase.initializeApp({
  apiKey: "AIzaSyDG0dbM3yjSrlx5Q-qfH3jRjPqnWfJaPNg",
  authDomain: "savebite-57268.firebaseapp.com",
  projectId: "savebite-57268",
  messagingSenderId: "184485874423",
  appId: "1:184485874423:web:4295c2e1eb12ab0c5ca1f2",
});



const messaging =
firebase.messaging();



messaging.onBackgroundMessage(
(payload)=>{


 self.registration.showNotification(

  payload.notification.title,

  {

   body:
   payload.notification.body,

   icon:"/icon.png"

  }

 );


});