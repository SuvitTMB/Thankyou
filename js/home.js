var dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
ArrRecord = [];
ShowRecord = "";
timer = 0;

$(document).ready(function () {
  if(sessionStorage.getItem("ThankYou")==null) {
    document.getElementById('id01').style.display='block';
  }
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
  dbThankYou = firebase.firestore().collection("Thankyou");
  sessionStorage.setItem("ThankYou", "Coffee");
  GetDateRandom();
}


function GetDateRandom() {
  dbThankYou.orderBy('TimeStampDate','desc')
  .get().then((snapshot)=> {
  snapshot.forEach(doc=>{
      ArrRecord.push([doc.data().EmpID]);
    });
    var NewRecord = random_item(ArrRecord);
    ShowRecord = NewRecord[0];
    console.log(ShowRecord);
    console.log("Log="+ArrRecord);
    RandomThankYou();
  });  
}



function RandomThankYou() {
  var str = "";
  str += '<div class="grid">';
  dbThankYou.where('EmpID','==', ShowRecord)
  .limit(1)
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      str += '<div class="ShowRandomImg">';
      str += '<img src="'+doc.data().SendImg+'" style="width:100%;border-radius: 10px;"></div>';
      str += '<center><div class="textoverimg">'+ doc.data().SendMemo +'</div></center>';
      str += '<div style="margin-right: 80px;text-align: right;"><img src="./img/WeCare-logoW.png" style="margin-top:-114px;width:60px;position: absolute;"></div>';
      str += '<div class="btn-t1" onclick="viewpage(\''+ doc.id +'\')" style="margin-top:20px;">ดูรายละเอียด</div>  <div class="btn-t3" onclick="GotoViewAll()">ดูภาพทั้งหมด</div>';
    });
    document.getElementById('Loading').style.display='none';
    document.getElementById('DisplayRandom').style.display='block';
    $("#DisplayRandom").html(str);
    timer = setInterval(GetNewRecord, 20000);
    //setInterval("GetNewRecord();",20000); 
  });
}


function GetNewRecord() {
    stopTimer();
    document.getElementById('Loading').style.display='block';
    document.getElementById('DisplayRandom').style.display='none';
    var NewRecord = random_item(ArrRecord);
    ShowRecord = NewRecord[0];
    console.log(ShowRecord);
    RandomThankYou();
}

function random_item(items) {
  return items[Math.floor(Math.random()*items.length)];   
}


function stopTimer(){
  clearInterval(timer);
  //console.log("Stop Timer");
}


function viewpage(id) {
  location.href = "viewpage.html?gid="+id+"";
}


function CloseAll() {
  document.getElementById('id01').style.display='none';
}






