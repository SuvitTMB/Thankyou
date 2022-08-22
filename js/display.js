var dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });


$(document).ready(function () {
  if(sessionStorage.getItem("ThankYou")==null) { location.href = "index.html"; }
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
  dbSongkarn = firebase.firestore().collection("Thankyou");
  ShowIMG();
}


function ShowIMG() {
  var str = "";
  var CountImg = 0;
  str += '<div class="grid">';
  dbSongkarn.orderBy('TimeStampDate','desc')
  //.limit(60)
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      CountImg = CountImg+1;
      //str += '<figure class="effect-zoe" onclick="ViewSongkarn(\''+ doc.id +'\')">';
      str += '<figure class="effect-zoe" onclick="viewpage(\''+ doc.id +'\')">';
      str += '<img src="'+doc.data().SendImg+'"/>';
      str += '<figcaption><div style="font-weight: 600;font-size:11px;text-align:center;">'+doc.data().EmpName+'</div>';
      str += '</figcaption></figure>';
      //CountImg++;
    });
    str += '</div>';
    $("#DisplayCountImg").html('<div class="box-sendimg">ภาพประกวดรวม '+ CountImg +' ภาพ</div>');
    $("#DisplayImg").html(str);
  });
}


var EidSongkarn = "";
function ViewSongkarn(id) {
  var str = "";
  var sClickView = 0;
  dbSongkarn.where(firebase.firestore.FieldPath.documentId(), "==", id)
  .get().then((snapshot)=> {
  snapshot.forEach(doc=> {
      EidSongkarn = doc.id;
      sClickView = (doc.data().ClickView+1);
      str += '<div style="text-align:left;">';
      str += '<div style="text-align:center; color:#0056ff; padding:8px;">Songkran Family Happy Together </div>';
      str += '<div><img src="'+doc.data().SendImg+'" style="width:100%;"/></div>';
      str += '<div style="font-size:11px; color:#777;line-height:1.2; padding:8px 0;">'+doc.data().SendMemo+'</div>';
      str += '<div style="font-size:11px; color:#0056ff;">ส่งโดย : '+doc.data().EmpName+' | View : '+sClickView+'</div>';
      str += '</div>';
    });
    //dbSongkarn.doc(EidSongkarn).update({
    //  ClickView : sClickView
    //});
    $("#DisplaySongkarn").html(str);
  });
  document.getElementById('id01').style.display='block';
}


function viewpage(id) {
  location.href = "viewpage.html?gid="+id+"";
}

function GotoViewAll() {
  location.href = "viewall.html";
}
/*
function ShowVaccina() {
  //alert(sessionStorage.getItem("EmpID"));
  var str = "";
  //dbVaccine.where('EmpID','==',parseFloat(sessionStorage.getItem("EmpID")))
  dbVaccine.where('EmpID','==',sessionStorage.getItem("EmpID"))
  .orderBy('Vaccine_no','asc')
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      EidVaccine = doc.id;
      str += '<div class="box-vaccina"><div style="width:80px; height: 80px; float: left;text-align: center;">';
      str += '<img src="./img/syringe.png" class="img-syringe">';
      str += '<div style="font-size: 11px;margin-top:3px;">เข็มที่ '+doc.data().Vaccine_no+'</div></div>';
      str += '<div style="float: left;width:auto;line-height: 1.4;font-size: 12px;color:#888;font-weight: 400;">';
      str += 'วัคซีนเข็มที่ : '+doc.data().Vaccine_no+'<br>ชื่อวัคซีน : '+doc.data().Vaccine_name+'<br>สถานที่ฉีด : '+doc.data().Vaccine_place+'<br>เมื่อวันที่ : '+ConvrtDate(doc.data().Vaccine_date)+'</div>';
      str += '<div style="width:60px; height: 60px; float: right;text-align: center;">';
      str += '<img src="./img/edit.png" class="hover-edit" onclick="EditVaccine(\''+ doc.id +'\')"><br>';
      str += '<img src="./img/delete.png" class="hover-edit" onclick="DelVaccine(\''+ doc.id +'\')"></div></div>';
    });
    $("#DisplayVaccine").html(str);
  });


}


function AddNewVaccina() {
  var str = "";

  str += '<div>เพิ่มประวัติการฉีดวัคซีน</div>';
  str += '<div class="btn-t2" onclick="CloseAll()" style="margin:15px auto 10px 10px;font-size:11px;">ปิดหน้าต่างนี้</div>';
  $("#NewVaccina").html(str);
  document.getElementById("id01").style.display = "block";
}


var sCheckBottom = 0;
function ClickSaveVaccine() {
  sCheckBottom = 0;
  stxtNoVaccine = document.getElementById("txtNoVaccine").value;
  stxtNameVaccine = document.getElementById("txtNameVaccine").value;
  stxtPlace = document.getElementById("txtPlace").value;
  stxtDate = document.getElementById("txtDate").value;
  if(stxtNoVaccine !== null && stxtNoVaccine !== '') { sCheckBottom = sCheckBottom+1; }
  if(stxtNameVaccine !== null && stxtNameVaccine !== '') { sCheckBottom = sCheckBottom+1; }
  if(stxtPlace !== null && stxtPlace !== '') { sCheckBottom = sCheckBottom+1; }
  if(stxtDate !== null && stxtDate !== '') { sCheckBottom = sCheckBottom+1; }
  if(sCheckBottom==4) {
    SaveData();
  } else {
    alert("คุณยังกรอกข้อมูลไม่ครบถ้วน = "+sCheckBottom);
  }
}


function SaveData() {
  NewDate();
  if(EidVaccine!="") {
    dbVaccine.doc(EidVaccine).update({
      Vaccine_no : document.getElementById("txtNoVaccine").value,
      Vaccine_name : document.getElementById("txtNameVaccine").value,
      Vaccine_place : document.getElementById("txtPlace").value,
      Vaccine_date : document.getElementById("txtDate").value,
      Vaccine_update : dateString
    });        
  } else {
    dbVaccine.add({
      LineID : sessionStorage.getItem("LineID"),
      LineName : sessionStorage.getItem("LineName"),
      LinePicture : sessionStorage.getItem("LinePicture"),
      EmpID : sessionStorage.getItem("EmpID"),
      EmpName : sessionStorage.getItem("EmpName"),
      //EmpPhone : document.getElementById("txtEmpPhone").value,
      Vaccine_no : document.getElementById("txtNoVaccine").value,
      Vaccine_name : document.getElementById("txtNameVaccine").value,
      Vaccine_place : document.getElementById("txtPlace").value,
      Vaccine_date : document.getElementById("txtDate").value,
      Vaccine_update : dateString
    });
  }
  ShowVaccina();
  document.getElementById('id01').style.display='none';
}


function EditVaccine(id) {
  dbVaccine.where(firebase.firestore.FieldPath.documentId(), "==", id)
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      EidVaccine = doc.id;
      document.getElementById("txtNoVaccine").value = doc.data().Vaccine_no;
      document.getElementById("txtNameVaccine").value = doc.data().Vaccine_name;
      document.getElementById("txtPlace").value = doc.data().Vaccine_place;
      document.getElementById("txtDate").value = doc.data().Vaccine_date;
    });
  });
  document.getElementById("id01").style.display = "block";
}


function DelVaccine(id) {
  dbVaccine.doc(id).delete();
  ShowVaccina();
  //document.getElementById("id02").style.display = "none";
}


function CloseAll() {
  document.getElementById('id01').style.display='none';
  document.getElementById('id02').style.display='none';
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

/*

var ArrBootCamp = new Array();
var json = "";
function GetAllCampaigns() {
  var i = 0;
  dbBootCamp.get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      ArrBootCamp.push([doc.data().CampRound, doc.data().CampName, doc.data().Hotel, doc.data().TrainingDays, doc.data().CampStatus]);
      i = i+1;
    });
    json = ArrBootCamp.map(function (value, key) {
      return {
          "CampRound": value[0],
          "CampName": value[1],
          "Hotel": value[2],
          "TrainingDays": value[3],
          "CampStatus": value[4]
      }
    });
    //console.log(json);
    //var SearchJob = "CYC/CYB#4";
    //console.log(JSON.stringify(json)); // need string
    //var filterJob = json.filter(item => item.EmpType.indexOf(SearchJob) > -1);
    //console.log("Job Name === "+filterJob[0].CampName);
  });
}



function GetUserRegister() {
  var SumRegister = 0;
  var str = '';
  var filterJob = '';
  //str += '<table class="table table-bordered table-striped table-responsive-stack" style="margin:10px auto;width:95%;">';
  //str += '<thead class="thead-dark"><tr style="background:#0056ff; color:#fff;"><th style="text-align: center">ข้อมูลการลงทะเบียนกิจกรรม</th></tr></thead><tbody>';
  dbBootRegister.where('EmpID','==',sessionStorage.getItem("EmpID"))
  //dbBootRegister.where('EmpID','==','48719')
  .orderBy('TimeStamp','desc')
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      SumRegister = SumRegister+1;
      filterJob = json.filter(item => item.CampRound.indexOf(doc.data().CampRound) > -1);
      //alert(filterJob[0].CampStatus+"==="+doc.data().CampRound);
      if(filterJob[0].CampStatus==0) {
        //str += '<tr><td style="line-height: 1.3;">';
        str += '<div onclick="OpenATK(\''+ doc.id +'\')">';
        if(doc.data().DateTime!="") { 
          str += '<div class="box-numberON"><img src="./img/Register.png" style="width:40px;margin-top:10px;"><div style="margin-top:2px;font-size:10px;">ลงทะเบียน</div></div>';
          str += '<div class="box-regON"><font color="#0056ff">'+ filterJob[0].CampName +'</font> ('+ filterJob[0].CampRound +')<br>'+ filterJob[0].TrainingDays +'<br>'+ filterJob[0].Hotel +'<br>ลงทะเบียน <font color="#f68b1f">'+ doc.data().DateTime +'</font></div>';
          str += '<div>';
        } else {
          str += '<div class="box-numberON"><img src="./img/Register.png" style="width:40px;margin-top:10px;"><div style="margin-top:2px;font-size:10px;">ลงทะเบียน</div></div>';
          str += '<div class="box-regON"><font color="#0056ff">'+ filterJob[0].CampName +'</font> ('+ filterJob[0].CampRound +')<br>'+ filterJob[0].TrainingDays +'<br>'+ filterJob[0].Hotel +'';
          str += '<br><font color="#ff0000">ลงทะเบียนล่วงหน้า</font> <font color="#f68b1f">'+ doc.data().PreDateTime +'</font></div>';
          //str += '<br>ลงทะเบียน <font color="#f68b1f">'+ doc.data().DateTime +'</font></div>';
          str += '<div>';
        }
      } else {
        //str += '<tr><td style="line-height: 1.3;">';
        //str += '<div class="box-number">'+ SumRegister +'</div>';
        if(doc.data().DateTime!="") {
          str += '<div>';
          str += '<div class="box-number"><img src="./img/true.png" width="40px"><div style="margin-top:5px;font-size:10px;">สำเร็จ</div></div>';
          str += '<div class="box-reg"><font color="#0056ff">'+ filterJob[0].CampName +'</font> ('+ filterJob[0].CampRound +')<br>'+ filterJob[0].TrainingDays +'<br>'+ filterJob[0].Hotel +'';
          str += '<br><font color="#3ec303">ลงทะเบียน</font> <font color="#f68b1f">'+ doc.data().DateTime +'</font></div>';
        } else {
          str += '<div onclick="DeleteRegister(\''+ doc.id +'\')">';
          str += '<div class="box-number"><img src="./img/false.png" width="40px"><div style="margin-top:5px;font-size:10px;">ไม่สำเร็จ</div></div>';
          str += '<div class="box-regNOT"><font color="#0056ff">'+ filterJob[0].CampName +'</font> ('+ filterJob[0].CampRound +')<br>'+ filterJob[0].TrainingDays +'<br>'+ filterJob[0].Hotel +'';
          str += '<br><font color="#ff0000">ลงทะเบียนล่วงหน้า</font> <font color="#f68b1f">'+ doc.data().PreDateTime +'</font></div>';
        }
        str += '<div>';
      }
    });
    //str += '</tbody></table>';
    $("#DisplaySumRegister").html("<div class='btn-t3'>ลงทะเบียนแล้วรวม "+SumRegister+" รายการ</div>");
    $("#DisplayRegister").html(str);
  });
}



function OpenATK(id) {
  //alert(id);
  var str = "";
  dbBootRegister.where(firebase.firestore.FieldPath.documentId(), "==", id)
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      EidStockList = doc.id;
      str += '<div style="margin-top:20px;">';
      //str += '<div class="redeem-header">'+ doc.data().EmpType +'</div>';
      //str += '<div class="box-member"><div><img src=\''+ doc.data().LinePicture +'\' style="width:120px;"></div></div>';

      str += '<div style="margin:auto;text-align: left;">';
      str += '<div class="redeem-txt5">'+ doc.data().EmpName +'</div>';
      //str += '<div class="redeem-txt4" style="width:100px;">โทรศัพท์</div>';
      //str += '<div class="redeem-txt5" style="width:480px;">'+ doc.data().EmpPhone +'</div>';
      //str += '<div class="redeem-txt4" style="width:100px;">สังกัด</div>';
      str += '<div class="redeem-txt5">'+ doc.data().EmpRH +'</div>';
      //str += '<div class="redeem-txt4" style="width:100px;">ลงทะเบียน</div>';
      //str += '<div class="redeem-txt5" style="width:480px;">'+ doc.data().DateTime +'</div><div class="clr"></div>';
      //str += '<div class="redeem-txt4" style="width:100px;">ผล ATK</div>';
      str += '<div class="redeem-txt5">'+ doc.data().ATK +'</div><div class="clr"></div>';
      //str += '<div class="redeem-txt4" style="width:100px;">รูป ATK</div>';
      str += '<div style="margin:15px;"><img src="'+ doc.data().ATKimg +'" width="100%;"></div>';
      str += '</div>';
      //str += '<div class="btn-t4" onclick="DeleteRec(\''+ doc.id +'\')" style="margin:30px auto 20px auto;">ลบรายการนี้</div>';
      str += '<div class="btn-t2" onclick="CloseAll()" style="margin:15px auto 10px 10px;font-size:11px;">ปิดหน้าต่างนี้</div>';
    });
    $("#DisplayByItem").html(str);
  });
  document.getElementById("id01").style.display = "block";
}


function DeleteRegister(id) {
  //alert(id);
  var str = "";
  dbBootRegister.where(firebase.firestore.FieldPath.documentId(), "==", id)
  .get().then((snapshot)=> {
    snapshot.forEach(doc=> {
      EidStockList = doc.id;
      str += '<div style="margin-top:20px;">';
      str += '<div style="margin:auto;text-align: left;">';
      str += '<div class="redeem-txt5">'+ doc.data().EmpName +'</div>';
      str += '<div class="redeem-txt5">'+ doc.data().EmpRH +'</div>';
      str += '<div class="redeem-txt5">'+ doc.data().ATK +'</div><div class="clr"></div>';
      str += '<div style="margin:15px;"><img src="'+ doc.data().ATKimg +'" width="100%;"></div>';
      str += '</div>';
      str += '<div class="btn-t4" onclick="DeleteRec(\''+ doc.id +'\')" style="font-size:11px; margin:10px auto 20px auto;">ลบรายการนี้</div>';
      str += '<div class="btn-t2" onclick="CloseAll()" style="margin:15px auto 10px 10px;font-size:11px;">ปิดหน้าต่างนี้</div>';
    });
    $("#DisplayDeleteItem").html(str);
  });
  document.getElementById("id02").style.display = "block";
}

function DeleteRec(x) {
  dbBootRegister.doc(x).delete();
  GetUserRegister();
  //alert("ลบข้อมูลเรียบร้อยแล้ว");
  document.getElementById("id02").style.display = "none";
}



*/

function CloseAll() {
  document.getElementById('id01').style.display='none';
}
