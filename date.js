// //We r not calling the function here, thats why here is no ()
// //We call this function, wich is bouned to const date, in app.js
// exports.getDate =  function() {
// //We turned getDate functione to anonimus function and bounded it to var getDate.
// //Than we ended up with:
// //exports.getDate = GetDate;
// //let GetDate =  function() { ...
// //Потом мы сделали все это короче и получили то что на строке 3.
//   const today = new Date();
//   const options = {
//     weekday: "long",
//     day: "numeric",
//     month: "long"
//   };
// 
//   return today.toLocaleDateString("en-US", options);
// };
//
// exports.getDay = function () {  //exports is shortcut for module.exports
//
//   const today = new Date();
//   const options = {
//     weekday: "long",
//   };
//
//   return today.toLocaleDateString("en-US", options);
// };
