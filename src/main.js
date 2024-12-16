import './style.css'
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
const firebaseConfig = {
  apiKey: "AIzaSyDz4K9YYZNP1oHoxMx3R674z1NsuS5M9Pc",
  authDomain: "finance-application-172bf.firebaseapp.com",
  projectId: "finance-application-172bf",
  storageBucket: "finance-application-172bf.firebasestorage.app",
  messagingSenderId: "164590268202",
  appId: "1:164590268202:web:d12d6a7fee6ff23cccb853",
  measurementId: "G-LV6JJ9740X",
};


import { getDatabase, ref, set, onValue, remove, get, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
let user_description = document.querySelector("#user_description");
let user_amount = document.querySelector("#user_amount");
let user_income_expense = document.querySelector("#user_income_expense");
let Add_Data = document.querySelector("#Add_Data");
let currentId;


// data add function
Add_Data.addEventListener("click", () => {
  AddData()
})
document.querySelector("#loader").classList.remove("hidden")
document.querySelector("#loader").classList.add("visible")
function AddData() {
  if (user_description.value.length < 1 && user_amount.value.length > 1) {
    document.querySelector(".description_status").innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Please, Enter the Description.`
    document.querySelector(".amount_status").innerHTML = null
  } else if (user_description.value.length > 1 && user_amount.value.length < 1) {
    document.querySelector(".amount_status").innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Please, Enter the Amount.`
    document.querySelector(".description_status").innerHTML = null
  } else if (Number(user_description.value)) {
    document.querySelector(".description_status").innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Your description must be a description.`
    document.querySelector(".amount_status").innerHTML = null
  } else if (user_amount.value < 0) {
    document.querySelector(".amount_status").innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Your Amount must be a positive value.`
    document.querySelector(".description_status").innerHTML = null
  } else if (user_description.value.length >= 1 && user_amount.value.length >= 1) {
    set(ref(db, 'users/' + Date.now()), {
      userDescription: user_description.value.toUpperCase(),
      userAmount: Number(user_amount.value),
      typeIE: user_income_expense.value
    }).then(() => {
      document.getElementById("status").innerHTML = "Added Successfully"
      setTimeout(() => {
        document.getElementById("status").innerHTML = null
      }, 2000);
      user_description.value = null;
      user_amount.value = null;
      document.querySelector(".description_status").innerHTML = null
      document.querySelector(".amount_status").innerHTML = null
    }).catch((error) => alert("UnSuccessfully: " + error));
  } else {
    document.querySelector(".description_status").innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Please, Enter Your Description.`
    document.querySelector(".amount_status").innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Please Enter Your Amount.`
  }
}
// data read function
onValue(ref(db, "users/"), (snapshot) => {
  const data = snapshot.val();
  // console.log(data);
  let Income_total = 0;
  let Expense_total = 0;
  let Balance_Amount = 0;
  let show_data = ""
  for (const key in data) {
    const { typeIE, userAmount, userDescription } = data[key]
    if (typeIE === "Income") {
      Income_total += userAmount
      // console.log("Income: " + items.useramount);
    } else if (typeIE === "Expense") {
      Expense_total += userAmount
      // console.log("Expense: " + items.useramount);
    }
    show_data += `
      <tr class="border-2 text-[10px] md:text-base text-center bg-[#1F2937] text-white">
      <td class="py-3 border-white border-2">${userDescription}</td>
      <td class="py-3 border-white border-2">${userAmount} /-</td>
      <td class="py-3 border-white border-2">${typeIE}</td>
      <td class="operations border-white border-2">
      <button class="hover:bg-[#dd9219] bg-[#F4A62A] text-white py-1 px-3 my-1 rounded-lg shadow-lg cursor-pointer" onclick="UpdateFunc('${key}')"> <i class="fa-regular fa-pen-to-square"></i></button>
      <button class="hover:bg-[#e13310] bg-[#FA3F19] text-white py-1 px-3 my-1 rounded-lg hover:shadow-lg cursor-pointer"
      onclick="DeleteFunc('${key}')"><i class="fa-solid fa-trash-can"></i></button>
      </td>
      </tr>`
    document.querySelector("#Insert_data").innerHTML = show_data
    Balance_Amount = Income_total - Expense_total
  }
  document.getElementById("income_total").innerHTML = `${Income_total} /-`
  document.getElementById("expense_total").innerHTML = `${Expense_total} /-`
  document.getElementById("Over_All_Total").innerHTML = `${Balance_Amount} /-`
  // console.log("hello world program");
  document.querySelector("#loader").classList.remove("visible")
  document.querySelector("#loader").classList.add("hidden")
})

// data update function
window.UpdateFunc = function (id) {
  currentId = id;
  get(ref(db, `users/${id}`)).then((items) => {
    const { userDescription, typeIE, userAmount } = items.val();
    user_description.value = userDescription;
    user_amount.value = userAmount;
    user_income_expense.value = typeIE;
  });
  // Toggle buttons
  document.querySelector("#Add_Data").classList.add("hidden");
  document.querySelector("#Update").classList.remove("hidden");
  document.querySelector("#Update").classList.add("visible");
};

// Single event listener
document.querySelector("#Update").addEventListener("click", () => {
  if (currentId) {
    // Validation logic
    if (user_description.value.length < 1 && user_amount.value.length > 1) {
      document.querySelector(".description_status").innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Please, Enter the Description.`
      document.querySelector(".amount_status").innerHTML = null
    }
    else if (user_description.value.length > 1 && user_amount.value.length < 1) {
      document.querySelector(".amount_status").innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Please, Enter the Amount.`
      document.querySelector(".description_status").innerHTML = null
    } else if (Number(user_description.value)) {
      document.querySelector(".description_status").innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Your description must be a description.`
      document.querySelector(".amount_status").innerHTML = null
    } else if (user_amount.value < 0) {
      document.querySelector(".amount_status").innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Your Amount must be a positive value.`
      document.querySelector(".description_status").innerHTML = null
    }
    else if (user_description.value.length >= 1 && user_amount.value.length >= 1) {
      update(ref(db, `users/${currentId}`), {
        userDescription: user_description.value.toUpperCase(),
        userAmount: Number(user_amount.value),
        typeIE: user_income_expense.value
      }).then(() => {
        document.querySelector(".description_status").innerHTML = null
        document.querySelector(".amount_status").innerHTML = null
        // Success message aur form reset
        document.getElementById("status").innerHTML = "Update Successfully"
        setTimeout(() => {
          document.getElementById("status").innerHTML = null
        }, 2000);
        currentId = null;
        // Toggle buttons back
        user_description.value = null;
        user_amount.value = null;
        document.querySelector("#Add_Data").classList.remove("hidden")
        document.querySelector("#Add_Data").classList.add("visible")
        document.querySelector("#Update").classList.remove("visible")
        document.querySelector("#Update").classList.add("hidden")
      }).catch((error) => { alert("Error: " + error) });
    } else {
      document.querySelector(".description_status").innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Please, Enter Your Description.`
      document.querySelector(".amount_status").innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Please Enter Your Amount.`
    }
  }
});
// data delete function

window.DeleteFunc = function (id) {
  remove(ref(db, `users/${id}`));
  document.getElementById("status").innerHTML = "Deleted Successfully"
  setTimeout(() => {
    document.getElementById("status").innerHTML = null
  }, 2000);
}


