const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
//const date = require(__dirname + "/date.js");

//console.log(date());

const app = express();

//const items = ["Drink coffee", "Study", "Eat Nori"];
//const workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//the code we got from the mongoDB Atlas when we choose to conect our app via driver. The last part, which replaced "/?retryWrites=true&w=majority" is creating our DB("/todolistDB").
mongoose.connect('mongodb+srv://admin-edwrdddk:test999@cluster0.yzpmwth.mongodb.net/todolistDB');

const itemsSchema = new mongoose.Schema ({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Welcome to ur todolist."
});

const item2 = new Item ({
  name: "Hit the + button to add a new item."
});

const item3 = new Item ({
  name: "Hit the checkbox to delete an item."
});

const defaultItems = [item1, item2, item3];


const listSchema = new mongoose.Schema ({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);


app.get('/', (req, res) => {
  //const day = date.getDate();
  Item.find({}, function(err, foundItems){  //foundItems because u can call them whatever u want.
    //console.log(foundItems);
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err){
      if(err) {
        console.log(err);
      } else {
        console.log("Succesfully saved default items to DB.");
      }
      });
      res.redirect("/"); //What this do is basicly redirect us to the else statment, so first 3 default items get rendered, otherwise the page will be just loading.
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if (!err) {
      if (!foundList) {
        //console.log("Doesn't exist.");
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //console.log("Exists!");
        //Show an existing list
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
      }
    }
  });


});

app.post("/", (req, res) => {
  //const item = req.body.newItem;
  ////"Work" we got from console.log(req.body) which gave this: { newItem: 'Cool', list: 'Work' }, the sacond pair comes from button name and value.
  //if (req.body.list === "Work") {
  //  workItems.push(item);
  //  res.redirect("/work");
  //} else {
  //  items.push(item);
  //  res.redirect("/");
  //}

  const itemName = req.body.newItem;
  const listName = req.body.list; //which correcponds to the name of the button in the list.ejs

  const item = new Item ({ //no matter whcih list the item came from, we still need to create it as a new item document .
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item); //we are tapping into array of items on line 43.
      foundList.save();
      res.redirect("/" + listName)
    });
  }

});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listNameDelete = req.body.listName;

  if (listNameDelete === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (!err) { //this means if there was no errors.
        console.log("Delete done.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listNameDelete}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err) {
        res.redirect("/" + listNameDelete);
      }
    });
  }

});

//app.get("/work", (req, res) => {
//  res.render("list", {listTitle: "Work List", newListItems: workItems});
//});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
