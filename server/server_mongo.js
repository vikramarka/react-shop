require("dotenv").config();
var express = require("express");
var bcrypt = require('bcrypt');
var bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const https = require("https");
const Sequelize = require("sequelize");

let jwt = require("jsonwebtoken");

var http = require("http");
const session = require("express-session");
const { check, validationResult } = require("express-validator/check");
const expressValidator = require("express-validator");
const cors = require("cors");
const passportInit = require("./lib/passport.init");
const authRouter = require("./lib/auth.router");
const { checklogin } = require("./lib/auth.controller");
const { checkToken } = require("./lib/middleware");
const { cryptPassword, comparePassword } = require("./lib/pgen");
const uniqueString = require("unique-string");

// Mail functionality
let mail = require("./nodeMailer");

const socketio = require("socket.io");
var passport = require("passport");
SESSION_SECRET = "justfortesting";
// CLIENT_ORIGIN="https://reactshop.amoha.co"
CLIENT_ORIGIN = "http://localhost:3000";
const stripe = require("stripe")("sk_test_rxGG6bAyvVn3goQP3AimI5dz");

let secret_key = require("./config.js").secret_key;

const port = 5000;
var app = express();
app.use(require("morgan")("combined"));
app.use(expressValidator());
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

const httpServer = http.createServer(app).listen(5000, () => {
  console.log(`Running on https://reactshop.amoha.co:${port}`);
});

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(passport.initialize());
passportInit();
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);
const io = socketio(httpServer);
app.set("io", io);

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectID = require('mongodb').ObjectID;
    /*
     * To get API token
     */
    app.get("/api/get_token", (req, res) => {
      let token = jwt.sign({}, secret_key, { expiresIn: "2h" });
      return res.json({ status: "success", token: token });
    });




MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("react-shop-admin");


    /*
     * To get Login Details
     */
    app.post("/api/login", checkToken, jsonParser, function(req, res) {
      let email = req.body.email;
      let pwd = req.body.pwd;
      dbo.collection("users").find({ email: { $eq: email } }).toArray(function(err, users) {
        console.log(users);
        if(users.length>0){
            bcrypt.compare(pwd,users[0].password, function(error, result) {
              // res == true
            console.log(result);
            if (error) {
              return res.json({ status: "error", msg: "Incorrect password." });
            } else if (result == false) {
              return res.json({ status: "error", msg: "Incorrect password." });
            } else if (result) {

                  let user = { name: users[0].name.first+' '+users[0].name.last, email: users[0].email };
                  let token = jwt.sign({ email: users[0].email, user: user }, secret_key, {
                    expiresIn: "2h"
                  });

                  return res.json({
                    status: "success",
                    user: user,
                    token: token
                  });

            }
            });
        }else {
          return res.json({
                  status: "error",
                  msg:
                    "Seems like you haven't registered.Please signup through other means."
          });
        }
      });
      });
      app.use("/api/sociallogin", authRouter);
      app.get("/loginsuccess", function(req, res) {
        res.render("success");
      });

      app.get("/api/checkuser", checkToken, checklogin);

      app.get("/setpassword", function(req, res) {
        let userEmail= req.session.user.email;
        dbo.collection("users").find({ email: { $eq: userEmail } }).toArray(function(err, data) {
            if (data.length > 0) {
              return res.redirect("loginsuccess");
            } else {
              return res.render("userform", {
                errors: null,
                user: { name: req.session.user.name, email: req.session.user.email }
              });
            }
          });
      });
      app.get("/forbidden", function(req, res) {
        res.render("forbidden");
      });

      app.post(
        "/setpassword",
        [
          // username must be an email
          check("name")
            .isLength({ min: 1 })
            .withMessage("Name is required."),
          check("email")
            .isLength({ min: 1 })
            .withMessage("Name is required.")
            .isEmail()
            .withMessage("Please provide a valid email address"),
          check("pwd")
            .isLength({ min: 0 })
            .withMessage("Password is required.")
            .isLength({ min: 6 })
            .withMessage("Minimum 6 characters required."),
          check("rpwd")
            .custom((value, { req }) => value === req.body.pwd)
            .withMessage("Passwords must matched.")
        ],
        function(req, res) {
          if (req.session.user) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              res.render("userform", { errors: errors.array(), user: req.body });
            } else {
              cryptPassword(req.body.pwd, function(error, hash) {
                if (hash) {
                    let user = {
                        name:{first: req.body.name,last: ""},
                        isAdmin:false,
                        email:req.body.email,
                        password:hash,
                    };

                    dbo.collection("users").save(user, (err, result) => {
                      if(err) {
                        console.log(err);
                      }
                      res.redirect("loginsuccess");
                    });
                }
              });
            }
          } else {
            res.redirect("forbidden");
          }
        });
      // /**************** Customer cart API Calls *****************/
      // /*
      //  * creating customer
      //  * Parameters {inName,inEmail,inPassword}
      //  */
      // app.post("/api/create-customer", checkToken, (req, res) => {
      //   let inName = req.body.inName;
      //   let inEmail = req.body.inEmail;
      //   let inPassword = req.body.inPassword;
      //   sequelize
      //     .query("CALL customer_add(:inName,:inEmail,:inPassword)", {
      //       replacements: { inName: inName, inEmail: inEmail, inPassword: inPassword }
      //     })
      //     .then(create_customer => res.json(create_customer));
      // });
      /*
       * To get customer
       * Parameters {inCustomerId}
       */
      app.post("/api/get-customer", checkToken, (req, res) => {
        console.log("/api/get-customer",req);
        let inCustomerId = req.body.inCustomerId;
        let inEmail = req.body.inEmail;

        if (inCustomerId) {
            console.log("inCustomerId",inCustomerId);
          dbo.collection("users").find({ _id: { $eq: inCustomerId } }).toArray(function(err, get_customer) {
              res.json(get_customer);
            });

        } else {
          console.log("inEmail",inEmail);
          dbo.collection("users").find({ email: { $eq: inEmail } }).toArray(function(err, customer_info) {
              console.log(customer_info);
              dbo.collection("users").find({ _id: { $eq: customer_info[0]._id } }).toArray(function(err, get_customer) {
                  res.json(get_customer);
              });
          });
        }
      });
      /*
       * To Check User Exist or Not, using given email
       * Parameters {inCustomerId}
       */
      app.post("/api/check-user", checkToken, (req, res) => {
        let inEmail = req.body.inEmail;
        dbo.collection("users").find({ email: { $eq: inEmail } }).toArray(function(err, get_user) {
            res.json(get_user);
        });
      });
      /*
       * To Get Customer Address
       * Parameters {inEmail}
       */
      app.post("/api/get-address", checkToken, jsonParser, (req, res) => {
        let inEmail = req.body.inEmail;
        //let inAddressId = req.body.inAddressId;
        if(req.body.inEmail){
          dbo.collection("users").find({ email: { $eq: inEmail } }).toArray(function(err, get_user) {
            console.log(get_user);
              dbo.collection("addresses").find({ customer_id: { $eq: get_user[0]._id } }).toArray(function(err, get_address) {
                  res.json(get_address);
              });
          });
        }
      });

      /*
       * To get shipping Regions.
       * Parameters not required
       */
      app.get("/api/get-customer-shipping-regions", checkToken, (req, res) => {
        dbo.collection("shipping_regions").find({}).toArray(function(err, get_shipping_regions) {
          console.log(get_shipping_regions);
          res.json(get_shipping_regions);
        });

      });

      /*
       * To get order shipping information.
       * Parameters{inShippingRegionId}
       */
      app.post("/api/get-order-shipping-info", checkToken, (req, res) => {
        let inShippingRegionId = req.body.inShippingRegionId;
        dbo.collection("shippings").find({}).toArray(function(err, get_shippings) {
          let shipping_details=[];

          get_shippings.map((shipping,ind)=>{
            let shipping_data={};
            if(shipping.shipping_region.toString() == inShippingRegionId.toString() ){
              shipping_data.shipping_id=shipping._id;
              shipping_data.shipping_cost=shipping.shipping_cost;
              shipping_data.shipping_type=shipping.shipping_type;
              shipping_data.shipping_region=shipping.shipping_region;
              shipping_details.push(shipping_data);
            }
          })
          res.json(shipping_details);
        });
      });

      app.post("/api/payment", checkToken, jsonParser, (req, response) => {
        let amount = Math.round(req.body.amount) * 100;
        let inOrderAddress = req.body.inOrderAddress;
        stripe.customers
          .create({
            email: req.body.email,
            card: req.body.id
          })
          .then(customer => {
            return stripe.charges.create({
              amount,
              description: "Customer Charge",
              currency: "usd",
              customer: customer.id
            });
          })
          .then(charge => {

            dbo.collection("users").find({email: { $eq: req.body.email}}).toArray(function(err, get_user) {
              let order = {
                inCartId: req.body.inCartId,
                inOrderAddress: inOrderAddress,
                inCustomerId: get_user[0]._id,
                inShippingId: req.body.inShippingId,
                inTaxId: req.body.inTaxId
              };

              dbo.collection("orders").save(order, (err, result) => {
                if(err) {
                  console.log(err);
                }
                console.log(result);


                });

              });
            })
          .catch(err => {
            console.log("Error:", err);
            response.status(500).send({ error: "Purchase Failed" });
          });
      });





    /*
     * To get all departments
     */
    app.get("/api/get-departments", checkToken, (req, res) => {
    dbo.collection("departments").find({}).toArray(function(err, departments) {
      if (err) throw err;
      let departments_details={};
      let departments_array=[];
      departments.map((value,index)=>{
      departments_details.department_id=value._id;
      departments_details.slug=value.slug;
      departments_details.name=value.name;
      departments_array.push(departments_details);
      departments_details={};
    });

    res.json(departments_array);
         // db.close();
    });
  });

  /*
   * To get all categories using departmentid
   * Parameters {inDepartmentId}
   */
   app.post("/api/get-department-categories", checkToken, (req, res) => {
       let department =ObjectID(req.body.inDepartmentId);

       dbo.collection("categories").find({department:department}).toArray(function(err, categories) {
         if (err) throw err;
         res.json(categories);
         // db.close();
       });
    });
    /*
     * To get all products using department id
     * Parameters {inDepartmentId, inShortProductDescriptionLength, inProductsPerPage, inStartItem }
     */
    app.post("/api/get-department-products", checkToken, (req, res) => {

      let inDepartmentId = ObjectID(req.body.inDepartmentId);

      dbo.collection("categories").find({department:inDepartmentId}).toArray(function(err, categories) {
        if (err) throw err;
        let category=[];
          categories.map((cat_data, index)=>{
            category.push(ObjectID(cat_data._id));
          });

          //let inShortProductDescriptionLength = ObjectID(req.body.inShortProductDescriptionLength);
          //let inProductsPerPage =  ObjectID(req.body.inProductsPerPage);
        //  let inStartItem =  ObjectID(req.body.inStartItem);
          dbo.collection("products").find({categories:{$in:category}}).toArray(function(err, products) {

            let products_array=[];
            let product_details=[];
            products.map((value,index)=>{
            product_details={};
            product_details.product_id=value._id;
            product_details.slug=value.slug;
            product_details.name=value.name;
            product_details.image=value.image.secure_url;
            product_details.image2=value.image2.secure_url;
            product_details.thumbnail=value.thumbnail.secure_url;
            product_details.price=value.price;
            product_details.discounted_price=value.discounted_price;
            product_details.category_id=value.categories;
            products_array.push(product_details);

          });

            if (err) throw err;
            res.json(products_array);
            // db.close();
          });
      });
      });
      /*
       * To get product details
       * Parameters {inProductId}
       */
      app.post("/api/product", checkToken, (req, res) => {
        let inProductId = ObjectID(req.body.inProductId);

        dbo.collection("products").find({}).toArray(function(err, products) {

          let products_array=[];
          let product_details=[];

          products.map((value,index)=>{

            let product_Id = ObjectID(value._id);

            if(inProductId.toString() === product_Id.toString()){
              product_details.product_id=value._id;
              product_details.slug=value.slug;
              product_details.name=value.name;
              product_details.image=value.image.secure_url;
              product_details.image2=value.image2.secure_url;
              product_details.thumbnail=value.thumbnail.secure_url;
              product_details.price=value.price;
              product_details.discounted_price=value.discounted_price;
              product_details.category_id=value.categories;
              products_array.push(product_details);
            }

          product_details={};
        });
          if (err) throw err;
          res.json(products_array);
          // db.close();
        });

      });

      /*
       * To get product locations
       * Parameters {inProductId}
       */
      app.post("/api/get-product-locations", checkToken, (req, res) => {
        let inProductId = ObjectID(req.body.inProductId);
        dbo.collection("products").find({}).toArray(function(err, products) {
          let products_array=[];
          let product_details=[];
          products.map((value,index)=>{
            product_details={};
            let product_Id = ObjectID(value._id);
            let category_Id = ObjectID(value.categories[0]);
              if(inProductId.toString() === product_Id.toString()){
                dbo.collection("categories").find({_id:category_Id}).toArray(function(err, categories) {
                  let department_Id = ObjectID(categories[0].department);
                  let catogory_name= categories[0].name;
                  dbo.collection("departments").find({_id:department_Id}).toArray(function(err, departments) {

                  product_details.catogory_id=category_Id;
                  product_details.catogory_name=catogory_name;
                  product_details.department_id=departments[0]._id;
                  product_details.department_name=departments[0].name;
                  products_array.push(product_details);

                  if (err) throw err;
                  res.json(products_array);
                  // db.close();
                });
                if (err) throw err;
                // db.close();
              });
            }
        });
        if (err) throw err;
        // db.close();
        });
      });

      /*
       * To get product recommendations
       * Parameters{inProductId, inShortProductDescriptionLength}
       */
      app.post("/api/get-product-recommendations", checkToken, (req, res) => {
        let inProductId = ObjectID(req.body.inProductId);
        let inShortProductDescriptionLength =
          req.body.inShortProductDescriptionLength;

      });

      /*
       * To add Selected Product to Cart insert or update Cart details.
       * Parameters{inCartId,inProductId,inAttributes}
       */
      app.post("/api/add-product-to-cart", checkToken, (req, res) => {
        let inCartId = req.body.inCartId;
        let inProductId = ObjectID(req.body.inProductId);
        let inAttributes = req.body.inAttributes;

        let i=1;
        if (!inCartId || inCartId == "null" || inCartId == null)
            inCartId = uniqueString();
            let cart_productid="";
            dbo.collection("shopping_carts").find({product_id:inProductId}).toArray(function(err, cart_details) {
              console.log("cart_details.product_id:",cart_details);
              if(cart_details[0]){
                cart_productid=cart_details[0].product_id;
              }

                if(inProductId.toString()===cart_productid.toString()){

                  let quantity_details=cart_details[0].quantity+1;
                  var shopping_cart_id = {
                    _id: new ObjectID(cart_details[0]._id)
                  };

                  dbo.collection("shopping_carts").updateOne(shopping_cart_id, {$set:{quantity: parseInt(quantity_details) }}, (err, result) => {
                    if(err) {
                      throw err;
                    }
                  });
                  }else {
                  let shopping_cart = {
                    cart_id: inCartId,
                    product_id: inProductId,
                    attributes:inAttributes,
                    quantity: parseInt(i) ,
                    buy_now:i,
                  };
                  dbo.collection("shopping_carts").save(shopping_cart, (err, result) => {
                    if(err) {
                      console.log(err);
                    }
                  });
                }
            });
          res.json({ inCartId: inCartId,inProductId:inProductId });
      });

      /*
       * To get all products from Cart.
       * Parameters{inCartId}
       */
      app.post("/api/get-shopping-cart-products", checkToken, (req, res) => {
        let inCartId =req.body.inCartId;
        dbo.collection("shopping_carts").find({cart_id:inCartId}).toArray(function(err, cart_details) {
        if (err) throw err;
        dbo.collection("products").find({}).toArray(function(err, products) {
        let products_array=[];
        let product_details={};
            products.map((value,index)=>{
              cart_details.map((cat_data, index)=>{
                let attributes=cat_data.attributes;
                let quantity=parseInt(cat_data.quantity);
                if(cat_data.product_id.toString()==value._id.toString())
                {
                  let subTotal="";
                  product_details.item_id=value.slug;
                  product_details.slug=value.slug;
                  product_details.name=value.name;
                  product_details.thumbnail=value.thumbnail.secure_url;
                  product_details.attributes=attributes;
                  product_details.price=value.price;
                  product_details.quantity=quantity;
                  subTotal=quantity*value.discounted_price;
                  product_details.subtotal=subTotal;
                  products_array.push(product_details);
                  product_details={};
                }
              });
            });
            // console.log("products_array",products_array);
            res.json(products_array);
        });
      });
     });


   /*
    *To remove product from cart.
    * Parameters{inItemId}
    */
   app.post("/api/remove-product-from-cart", checkToken, (req, res) => {
     let inItemId = req.body.inItemId;
     dbo.collection("products").find({slug:inItemId}).toArray(function(err, product) {
     if (err) throw err;
     console.log(product[0]._id,"product");
     dbo.collection('shopping_carts').deleteOne({product_id: product[0]._id}, (err, result) => {
      if(err) throw err;
      res.json("removed from cart");
     });
    });
   });
   /*
    * To update the shopping by increasing the quantity.
    * Parameters{inItemId,inQuantity}
    */
   app.post("/api/cart-update", checkToken, (req, res) => {
     let inItemId = req.body.inItemId;
     let inQuantity = parseInt(req.body.inQuantity);
     dbo.collection("products").find({slug:inItemId}).toArray(function(err, product) {
     if (err) throw err;
     var product_id = {
      product_id: new ObjectID(product[0]._id)
    };
     console.log(product[0]._id,"product");
     dbo.collection('shopping_carts').updateOne(product_id, {$set:{quantity: inQuantity}}, (err, result) => {
      if(err) throw err;
      res.json("updated cart");
     });
   });
   });
   /*
    * To get cart total amount.
    * Parameters{inCartId}
    */
   // app.post("/api/get-cart-total", checkToken, (req, res) => {
   //   let inCartId = req.body.inCartId;
   //   sequelize
   //     .query("CALL shopping_cart_get_total_amount(:inCartId)", {
   //       replacements: { inCartId: inCartId }
   //     })
   //     .then(get_total_amount => res.json(get_total_amount));
   // });

   /*
    * To delete Product Items from Cart.
    * Parameters{inCartId}
    */
   // app.post("/api/shopping-cart-empty", checkToken, (req, res) => {
   //   let inCartId = req.body.inCartId;
   //   sequelize
   //     .query("CALL shopping_cart_empty(:inCartId)", {
   //       replacements: { inCartId: inCartId }
   //     })
   //     .then(empty_cart => res.json(empty_cart));
   // });


});
