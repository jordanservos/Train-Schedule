// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDuWT6WU8MJ_hNeSu1PMhr1GuB2GtZgsWg",
    authDomain: "fir-demo-37ae2.firebaseapp.com",
    databaseURL: "https://fir-demo-37ae2.firebaseio.com",
    projectId: "fir-demo-37ae2",
    storageBucket: "fir-demo-37ae2.appspot.com",
    messagingSenderId: "881616232140",
    appId: "1:881616232140:web:5ec25d64ba3b4dd671ac69"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// assign firebase database to a variable 

var database = firebase.database();

//creat event listener for submit button click. Push data to firebase

$("#submit-btn").on("click", function() {
    console.log("Button Clicked!")
    var trainAdd = $("#submitTrainName").val();
    var destinationAdd = $("#submitDestination").val()
    var startTimeAdd = $("#submitStartTime").val();
    var frequencyAdd = $("#submitFrequency").val();

    database.ref().push({
        Train: trainAdd,
        Destination: destinationAdd,
        StartTime: startTimeAdd,
        Frequency: frequencyAdd,
    });

    // clear form fields after submission and focus cursor 
    $("#submitTrainName").val("").focus();
    $("#submitDestination").val("").focus();
    $("#submitStartTime").val("").focus();
    $("#submitFrequency").val("").focus();

});


// use moment.js to calculate all time related data in relation to current time
database.ref().on("child_added", function(snapshot) {
    var sv = snapshot.val();

    var firstTimeConverted = moment(sv.StartTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    var tRemainder = diffTime % sv.Frequency;
    var tMinutesTillTrain = sv.Frequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");


    var nextArrival = moment(nextTrain).format("hh:mm");
    var minutesAway = tMinutesTillTrain;

    var tBody = $("#trainTable");
    var tRow = $("<tr>");
    var colName = $("<td>").text(sv.Train);
    var colDestination = $("<td>").text(sv.Destination);
    var colStartTime = $("<td>").text(sv.StartTime);
    var colFrequency = $("<td>").text(sv.Frequency);
    var colNextArrival = $("<td>").text(nextArrival);
    var colMinutesAway = $("<td>").text(minutesAway);

    tRow.append(colName, colDestination, colFrequency, colNextArrival, colMinutesAway);
    tBody.append(tRow);

    // build error object
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});