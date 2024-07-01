// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
  remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
initializeApp(firebaseConfig);


// 独自関数を作る 
// 新規登録
// After
function signUpUser(email, password){
  const auth = getAuth();

  createUserWithEmailAndPassword(auth, email, password)
    .then(function (userInfo) {
      console.log('サインアップ成功', userInfo.user);
      location.href = 'index.html';
    })
    .catch(function (error) {
			console.log(error);
      $('#message').html(error);
    });
}

$("#signup-button").on("click", function () {
  const email = $("#signup-email").val();
  const password = $("#signup-password").val();
  // consoleログを入れて、データの流れを把握する
  console.log(email, password, 1)
  // {}を越えては情報が引き渡されないので、(email, password)とI/P必要+26行目にsignUpUser()の()にもemail, passwordのI/P必要
  signUpUser(email, password);
});

// 新規登録サインアップボタンを押した時の機能
// before
// $("#signup-button").on("click", function () {
  // const email = $("#signup-email").val();
  // const password = $("#signup-password").val();
  // Firebase機能を使うときに頻繁に発生するコード　認証機能を利用するときに必須のコード
  // const auth = getAuth();

  // createUserWithEmailAndPassword(auth, email, password)
    // .then(function (userInfo) {
      // 登録成功時にやりたいことを記入する
      // console.log("サインアップ成功:", userCredential.user);
    // })
    // .catch(function (error) {
      // 登録失敗時・エラー時にやりたいことを記入する
			// console.log(error);
    // });
// });


// 独自関数を作る 
// ログイン
// After
function loginUser(email, password) {
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then(function (userInfo) {
      console.log("ログイン成功:", userInfo.user);
      location.href = "index.html";
    })
    .catch(function (error) {
      $("#message").html(error);
    });
}

$("#login-button").on("click", function () {
  const email = $("#login-email").val();
  const password = $("#login-password").val();
  
  loginUser(email, password);
});

// ログインボタンを押した時の機能
// before
// $("#login-button").on("click", function () {
  // const email = $("#login-email").val();
  // const password = $("#login-password").val();
  // const auth = getAuth();

  // signInWithEmailAndPassword(auth, email, password)
    // .then(function (userInfo) {
      // console.log(userInfo);
      // location.href = "index.html";
    // })
    // .catch(function (error) {
			// console.log(error);
      // $('#message').html(error);
    // });
// });


// 独自関数を作る 
// ログアウト
// After
function logoutUser() {
  const auth = getAuth();
  signOut(auth)
    .then(function () {
      location.href = "login.html";
    })
    .catch(function (error) {
      $("#message").html(error);
    });
};

$("#logout-button").on("click", logoutUser);

// ログアウト
// before
// $("#logout-button").on("click", function(){
	// const auth = getAuth();
  // signOut(auth)
    // .then(function () {
      // location.href = "login.html";
    // })
    // .catch(function (error) {
      // $("#message").html(error);
    // });
// });

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const dbRef = ref(database, "chat");

// 送信ボタンを押した時の処理  #sendはHTMLのidを参照する
$('#send').on('click',function(){

// 入力欄に入力されたデータを取得する val()
  const userName = $('#userName').val();
  const text = $('#text').val();
  // 現在の日時を文字列として取得する
  const timestamp = new Date().toLocaleString();

// ちゃんと動くかをチェックするためにconsoleを利用する
  console.log(userName, text, timestamp);

// 送信データをオブジェクトにまとめる
  const message ={
    userName: userName,
    text: text,
    timestamp: timestamp
  };

// Firebase Realtime Databaseに送信する 
  const newPostRef = push(dbRef);
  set(newPostRef, message);
  
});

// 指定した場所にデータが追加されたことを検知
onChildAdded(dbRef,function(data){
  // 追加されたデータをFirebaseから受け取り、分解
  const message = data.val();
  const key = data.key;
  console.log(data, message, key);

  // 文字情報と変数をミックスで入れ込むために``を使う
  let chatMsg = ` 
      <div class="chat-item" data-key='${key}'>
          <div>${message.userName}</div>
          <div>${message.text}</div>
          <div class='timestamp'>${message.timestamp}</div>
          <div class='delete-btn'>削除</div>
      </div>
  `;

  // 指定した場所にデータを挿入する
  $('#output').append(chatMsg);
});

// 削除ボタンが押された時、Firebase Realtime Databaseから該当するメッセージを削除し、画面上からもそのメッセージを削除する
$(document).on('click', '.delete-btn', function() {
  const key = $(this).closest('.chat-item').data('key');
  const itemRef = ref(database, `chat/${key}`);
  remove(itemRef)
  .then(() => {
    console.log(`Message with key ${key} deleted from Firebase`);
    $(this).closest('.chat-item').remove();
  })
  .catch((error) => {
    console.error(`Error deleting message with key ${key}: `, error);
  });
});