import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";


async function registerPush(){

 const permission =
   await Notification.requestPermission();


 if(permission === "granted"){

   const token =
     await getToken(messaging,{
       vapidKey:
       "BD1S7MuGP-FRF2Ix_Ig7F5ycIcFLR-nAjcpJNhS_flgqZibdQg6KNXkXXEhqh0LqYLfBhyQhNPjolNDo2-33df8"
     });


   console.log(
     "FCM TOKEN:",
     token
   );


   // kirim ke backend
 }

}


registerPush();