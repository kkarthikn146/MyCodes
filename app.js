

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require("mongoose");





const homeStartingContent = "This is my basic Application like a Google keep.I developed this app mainly to store all my programming notes easily and get easily whenever I want to study or included some of Specifications in to easily manage notes in this application. Its my first app with easily store and get notes,but I would like to make better with some changes.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

// const posts =[];

mongoose.connect("mongodb+srv://admin-karthik146:karthik146@cluster0.pmlzy.mongodb.net/mycodesDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



const codeSchema = new mongoose.Schema({
    Title: {
        type: String
    },
    Content: {
        type: String
    },
    whichSection : String,
    Comments :[{type: String}]

});

const sectionSchema = new mongoose.Schema({
    SectionName : { type: String, unique: true },
});


const Code = mongoose.model("Code", codeSchema);
const Section = mongoose.model("Section",sectionSchema);


app.get("/", function (req, res) {

    


    Code.find({}, function (err, foundCodes) {
        console.log("codes" + foundCodes);

        Section.find({},function(err,allSections){
            //console.log(allSections);

            res.render("home", {
                sectionAll:allSections,
                content: homeStartingContent,
                composed: foundCodes
            });
        });

        
       

    });




});

app.get("/about", function (req, res) {
    res.render("about", {
        content: aboutContent
    });
});

app.get("/contact", function (req, res) {
    res.render("contact", {
        content: contactContent
    });
});

app.get("/compose", function (req, res) {


    Section.find({},'SectionName-_id',function(err,allSections){
        console.log(allSections);

        res.render("compose", {
             sectionList : allSections
        });
    });

   
});

app.post("/compose", function (req, res) {


    const title = req.body.postTitle;
    const slug = _.kebabCase(req.body.postTitle);
    const body = req.body.postBody;
    const sect = req.body.secName;


    //posts.push(postObj);
    var code = new Code({
        Title: title,
        Content: body,
        whichSection : sect
    });

    code.save();
    res.redirect("/");





});

app.get("/posts/:key", function (req, res) {


    var reqTitle = _.lowerCase(req.params.key);


    Code.find({}, function (err, foundCodes) {
        console.log("Total number of Codes" + foundCodes);

        foundCodes.forEach(function (eachCode) {
            var storedTitle = _.lowerCase(eachCode.Title);

            if (reqTitle === storedTitle) {
                //console.log("match Found!!..");
                res.render("post", {
                    neededPost: eachCode
                });
            } else {
                console.log("Not Found");
            }
        });



    });



});

app.post("/comment",function(req,res){
    // console.log(req.body.comment);
    // console.log(req.body.whichTitle);
    Code.findOne({Title:req.body.whichTitle},function(err,foundCodes){
        if (err) {
            console.log(err);
        }else{
            foundCodes.Comments.push(req.body.comment);
            foundCodes.save();
            res.redirect("posts/"+req.body.whichTitle);
        }
    });
});

app.get("/newSection",function(req,res){
    res.render("addNewSection");
});

app.post("/newSection",function(req,res){
    const newSection = req.body.sectionName;
  
    var section = new Section({
        SectionName: newSection
    });

    section.save();
    res.redirect("/");
    

});

app.get("/customOnly/:cusSection",function(req,res){
    const section = req.params.cusSection;
    
    Code.find({whichSection:section},function(err,foundNotes){
        if(err){
            console.log(err);
        }else{
            res.render("onlySection",{
                sectionNotes : foundNotes
            });
        }
    });
});



app.get("/custom/:customSection",function(req,res){
    console.log(req.params.customSection);

    res.render("compose",{
        whichSection : req.params.customSection
    });

   // res.render("onlySection");
});


app.get("/allSectionList",function(req,res){


    Section.find({},function(err,allSections){
        //console.log(allSections);

        res.render("allSectionList", {
            sectionAll:allSections
            
        });
    });


   
});











app.listen(3000, function () {
    console.log("Server started on port 3000");
});


