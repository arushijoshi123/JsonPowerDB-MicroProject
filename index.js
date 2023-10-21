// javascript file index.js
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";

var stuDBName = "SCHOOL-DB";
var stuRealationName = "STUDENT-TABLE ";
var connToken = "90931579|-31949333939974666|90960094";

$(document).ready(function () {
  $("#roll").focus();
});

function saveRecNoLS(jsonObj) {
  var lvData = JSON.parse(jsonObj.data);
  localStorage.setItem("recno", lvData.rec_no);
}

function getStuIdAsJsonObj() {
  var roll = $("#roll").val();
  var jsonStr = {
    id: roll,
  };
  return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
  saveRecNoLS(jsonObj);
  var record = JSON.parse(jsonObj.data).record;
  $("#name").val(record.name);
  $("#stuclass").val(record.stuclass);
  $("#dob").val(record.dob);
  $("#address").val(record.address);
  $("#enroldate").val(record.enroldate);
}

function resetForm() {
  $("#roll").val("");
  $("#name").val("");
  $("#stuclass").val("");
  $("#dob").val("");
  $("#address").val("");
  $("#enroldate").val("");
  $("#roll").prop("disabled", false);
  $("#save").prop("disabled", true);
  $("#change").prop("disabled", true);
  $("#reset").prop("disabled", true);
  $("#roll").focus();
}

function validateData() {
  var roll, name, stuclass, dob, address, enroldate;
  roll = $("#roll").val();
  name = $("#name").val();
  stuclass = $("#stuclass").val();
  dob = $("#dob").val();
  address = $("#address").val();
  enroldate = $("#enroldate").val();

  if (roll == "") {
    alert("Student roll missing");
    $("#roll").focus();
    return "";
  }
  if (name == "") {
    alert(" Student  name is missing");
    $("#name").focus();
    return "";
  }
  if (stuclass == "") {
    alert("Student Class is missing");
    $("#stuclass").focus();
    return "";
  }
  if (dob == "") {
    alert("DOB is missing");
    $("#dob").focus();
    return "";
  }
  if (address == "") {
    alert("DA is missing");
    $("#address").focus();
    return "";
  }
  if (enroldate == "") {
    alert("Enrollment date is missing");
    $("#enroldate").focus();
    return "";
  }

  var jsonStrObj = {
    id: roll,
    name: name,
    stuclass: stuclass,
    dob: dob,
    address: address,
    enroldate: enroldate,
  };
  return JSON.stringify(jsonStrObj);
}

function getStu() {
  var stuIdJsonObj = getStuIdAsJsonObj();
  var getRequest = createGET_BY_KEYRequest(
    connToken,
    stuDBName,
    stuRealationName,
    stuIdJsonObj
  );

  jQuery.ajaxSetup({ async: false });

  var resJsonObj = executeCommandAtGivenBaseUrl(
    getRequest,
    jpdbBaseURL,
    jpdbIRL
  );
  jQuery.ajaxSetup({ async: true });

  if (resJsonObj.status == 400) {
    console.log(resJsonObj.status);
    // The record doesn't exist, so allow saving a new record.
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#change").prop("disabled", true);
    $("#name").focus();
  } else if (resJsonObj.status == 200) {
    console.log(resJsonObj.status);
    // The record exists, so display the data and allow editing.
    $("#roll").prop("disabled", true);
    fillData(resJsonObj);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);

    $("#name").focus();
  }
}
function saveData() {
  var jsonStrObj = validateData();
  if (jsonStrObj == "") {
    return;
  }
  var putRequest = createPUTRequest(
    connToken,
    jsonStrObj,
    stuDBName,
    stuRealationName
  );
  alert("data saved successfully....");
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    putRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  console.log(resJsonObj);
  resetForm();
  $("#roll").focus();
}

function changeData() {
  $("#change").prop("disabled", true);
  var jsonChg = validateData();
  var updateRequest = createUPDATERecordRequest(
    connToken,
    jsonChg,
    stuDBName,
    stuRealationName,
    localStorage.getItem("recno")
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    updateRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  console.log(resJsonObj);

  resetForm();
  alert("Data Updated Successfully");
  $("#roll").focus();
}
