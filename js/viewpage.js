var dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
var sViewID = "";
var sClickMemo = 0;
var sClickView = 0;
var sGetPicLike = "";

$(document).ready(function () {
  if(sessionStorage.getItem("ThankYou")==null) { location.href = "index.html"; }
  sViewID = getParameterByName('gid');
  Connect_DB();
});

function Connect_DB() {
  var firebaseConfig = {
    apiKey: "AIzaSyDfTJJ425U4OY0xac6jdhtSxDeuJ-OF-lE",
    authDomain: "retailproject-6f4fc.firebaseapp.com",
    projectId: "retailproject-6f4fc",
    databaseURL: "https://file-upload-6f4fc.firebaseio.com",
    storageBucket: "retailproject-6f4fc.appspot.com",
    messagingSenderId: "653667385625",
    appId: "1:653667385625:web:a5aed08500de80839f0588",
    measurementId: "G-9SKTRHHSW9"
  };
  firebase.initializeApp(firebaseConfig);
  dbThankyou = firebase.firestore().collection("Thankyou");
  dbThankyouMemo = firebase.firestore().collection("ThankyouMemo");
  dbThankyouLike = firebase.firestore().collection("ThankyouLike");
  ShowView();
}


function getParameterByName(name, url) {
  str = '';
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



var EidThankyou = "";
function ShowView() {
  var str = "";
  var str1 = "";
  var str2 = "";
  dbThankyou.where(firebase.firestore.FieldPath.documentId(), "==", sViewID)
  .get().then((snapshot)=> {
  snapshot.forEach(doc=> {
      EidThankyou = doc.id;
      sClickView = (doc.data().ClickView+1);
      sClickMemo = doc.data().ClickMemo;
      str2 += '<div id="DisplayShowLike"></div>';
      $("#DisplayVote").html(str2);


      str += '<div style="margin-top:51px;">';
      str += '<center><img src="'+doc.data().SendImg+'" style="width:100%; max-width: 500px;"></center>';
      str += '</div>';
      str += '<div class="chart-memo">'+ doc.data().SendMemo +'</div>';
      $("#DisplayIMG").html(str);

      str1 += '<div class="chart-box">';
      str1 += '<div class="chart-img"><img src="'+ doc.data().LinePicture +'" onerror="javascript:imgError(this)" class="chart-profilt" title="'+ doc.data().LineName +'"></div>';
      str1 += '<div class="chart-text" style="color:#0056ff;font-size:11px; font-weight: 600;width:72%;">'+doc.data().EmpName+'<div class="chart-date">'+doc.data().SendBRworking+' | '+doc.data().SendUnderRH+'</div></div>';
      str1 += '<div style="width:12%;float:left;text-align:center;margin-top:5px;"><div id="ShowClickLike"></div></div></div>';

      str1 += '<div class="boxvdo-line2"><div class="boxvdo-icon1" style="font-size:10px;">';
      str1 += '<img src="./img/reading.png" class="boxvdoimg"> <span>'+sClickView+'</span> View</div>';
      str1 += '<div class="boxvdo-icon1" style="font-size:10px;"><img src="./img/like.png" class="boxvdoimg"> <span id="GetClickLike">'+doc.data().ClickLike+'</span> Like</div>';
      str1 += '<div class="boxvdo-icon1" style="font-size:10px;"><img src="./img/ans.png" class="boxvdoimg"> <span>'+doc.data().ClickMemo+'</span> Msg</div>';
      str1 += '<div class="boxvdo-icon" style="font-size:10px;"><img src="./img/watches.png" class="boxvdoimg"> <span>'+ doc.data().Senddate +'</span></div>';
      str1 += '</div></div>';
      $("#DisplayDetail").html(str1);
    });
    dbThankyou.doc(EidThankyou).update({
      ClickView : sClickView
    });
    //CheckUserLike();
    CheckUserLike();
    ShowLike();
    ShowMemo();
    //$("#DisplayDetail").html(str);
  });
}

var sClickLike = 0;
function CheckCountLike() {
  dbThankyou.where(firebase.firestore.FieldPath.documentId(), "==", sViewID)
  .get().then((snapshot)=> {
  snapshot.forEach(doc=> {
      sClickLike = doc.data().ClickLike+1;
      $("#GetClickLike").html(doc.data().ClickLike);
    });
    //alert("Like="+sClickLike);
  });
}


var sClickLike_user = 0;
function CheckUserLike() {
  CheckCountLike();
  var str = "";
  dbThankyouLike.where('LineID','==',sessionStorage.getItem("LineID"))
  .where('LikeID','==',sViewID)
  .orderBy('LikeTimeStamp','desc')
  .get().then((snapshot)=> {
  snapshot.forEach(doc=> {
      sClickLike_user  = 1;
    });
    if(sClickLike_user==0) {
      str +='<img src="./img/like1.png" class="chart-like" id="ShowClickLike" onclick="SaveClickLike()">';
    } else {
      str +='<img src="./img/like.png" class="chart-dislike" id="ShowClickLike">';
    }
    $("#ShowClickLike").html(str);
  });
}


function SaveClickLike() {
  CheckCountLike();
  //alert("Click Like="+EidThankyou);
  NewDate();
  var TimeStampDate = Math.round(Date.now() / 1000);
  dbThankyouLike.add({
    LineID : sessionStorage.getItem("LineID"),
    LineName : sessionStorage.getItem("LineName"),
    LinePicture : sessionStorage.getItem("LinePicture"),
    EmpID : sessionStorage.getItem("EmpID"),
    EmpName : sessionStorage.getItem("EmpName"),
    LikeID : EidThankyou,
    LikeDate : dateString,
    LikeTimeStamp : TimeStampDate
  });
  dbThankyou.doc(EidThankyou).update({
    ClickLike : sClickLike
  });
  CheckUserLike();
  CheckCountLike();
  ShowLike();
  document.getElementById('id03').style.display='block';
  //alert("Save");
}


function ShowMemo() {
  var i = 0;
  var str = "";
  dbThankyouMemo.where('RefID','==',EidThankyou)
  .orderBy('WriteTimeStamp','desc')
  .get().then((snapshot)=> {
  snapshot.forEach(doc=> {
      str +='<div class="chart-box">';
      str +='<div class="chart-img"><img src="'+ doc.data().LinePicture +'" onerror="javascript:imgError(this)" class="chart-profilt" title="'+ doc.data().LineName +'"></div>';
      str +='<div class="chart-text">'+doc.data().WriteMemo+'<div class="chart-date"><b><font color="#f68b1f">'+ doc.data().LineName +'</font></b> | โพส : '+doc.data().WriteDate+'</div></div></div>';
      str +='<div class="clr"></div>';
      i++;
    });
    if(i==0) {
      str = '<div style="border:1px solid #ccc; background-color: #f1f1f1; border-radius: 10px;padding:20px;text-align: center;">ยังไม่มีข้อความจากเพื่อน</div>';
    }
    $("#DisplayQuestion").html(str);
  });
}


function ShowLike() {
  var xCheck = "";
  var xxx = "";
  var str = "";
  var i = 0;
  dbThankyouLike.where('LikeID','==',sViewID)
  .orderBy('LikeTimeStamp','desc')
  .get().then((snapshot)=> {
  snapshot.forEach(doc=> {
      str += '<img src="'+ doc.data().LinePicture +'" onerror="javascript:imgError(this)" class="chart-view" title="'+ doc.data().LineName +'">';
      i++;
    });
    if(i==0) {
      str = '<div style="border:1px solid #ccc; background-color: #f1f1f1; border-radius: 10px;padding:20px;text-align: center;">ยังไม่มีกำลังใจจากเพื่อนของเรา</div>';
    }
    //alert(i);
    $("#DisplayShowLike").html(str);
  });
}


function imgError(image) {
    image.onerror = "";
    image.src = "./img/box.jpg";
    return true;
}



function ClickSendQ() {
  var sMemo = document.getElementById("txtDetail").value;
  sClickMemo = (sClickMemo+1);
  if(sMemo!="") {
    NewDate();
    var TimeStampDate = Math.round(Date.now() / 1000);
    sClickView = sClickView+1;
    dbThankyouMemo.add({
      LineID : sessionStorage.getItem("LineID"),
      LineName : sessionStorage.getItem("LineName"),
      LinePicture : sessionStorage.getItem("LinePicture"),
      EmpID : sessionStorage.getItem("EmpID"),
      EmpName : sessionStorage.getItem("EmpName"),
      RefID : EidThankyou,
      WriteMemo : sMemo,
      WriteDate : dateString,
      WriteTimeStamp : TimeStampDate
    });
    dbThankyou.doc(EidThankyou).update({
      ClickMemo : sClickMemo
    });
    ShowView();
    //ShowMemo();
    document.getElementById("txtDetail").value = "";
    document.getElementById('id01').style.display='block';
  } else {
    document.getElementById('id02').style.display='block';

  }
}

function GotoAllPage() {
  location.href = "display.html";
}

function CloseAll() {
  document.getElementById('id01').style.display='none';
  document.getElementById('id02').style.display='none';
  document.getElementById('id03').style.display='none';
}



function NewDate() {
  var today = new Date();
  var day = today.getDate() + "";
  var month = (today.getMonth() + 1) + "";
  var year = today.getFullYear() + "";
  var hour = today.getHours() + "";
  var minutes = today.getMinutes() + "";
  var seconds = today.getSeconds() + "";
  var ampm = hour >= 12 ? 'PM' : 'AM';
  day = checkZero(day);
  month = checkZero(month);
  year = checkZero(year);
  hour = checkZero(hour);
  minutes = checkZero(minutes);
  seconds = checkZero(seconds);
  dateString = day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds +" "+ ampm;
}


function ConvrtDate(str) {
  var date = new Date(str),
  mnth = ("0" + (date.getMonth() + 1)).slice(-2),
  day = ("0" + date.getDate()).slice(-2);
  return [day, mnth, date.getFullYear()+543].join("/");
}


function checkZero(data){
  if(data.length == 1){
    data = "0" + data;
  }
  return data;
}
