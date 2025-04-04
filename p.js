const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
//jisjis elements ki zarurat padni thi uske liye hmne--
//custom atttribute bnaya aur usko fetch kar liya. 

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatebutton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!``@#$%^&*(){}[];_<>.,/?|';
// the symbols are to be chose at random so let include all of them
 
let password="";
let passwordLength = 0;
let checkCount = 0;
handleSlider();
//set strength circle color to grey
setIndicator("#ccc");

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
 //or kuch bhi karna chahiye?
 const min = inputSlider.min;
 const max = inputSlider.max;
  inputSlider.style.backgroundSize=((passwordLength - min)*100/(max-min))+"%100%";
  calcStrength();

}

function setIndicator(color) {
    console.log("Setting indicator color to:", color);//Debugging Log
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


function getRndInteger(min,max) {
      return Math.floor(Math.random() * (max-min)) + min; 
      //.floor to remove the floating numbers and keep the integers & Math.random to choose the random numbers (b/w 0-1)   
}


function generateRandomNumber(){
    return getRndInteger(0,10);
}


function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123))
}


function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91))
}


function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}


// function calcStrength() {
//     let hasUpper = false;
//     let hasLower = false;
//     let hasNum = false;
//     let hasSym = false;
//     if (uppercaseCheck.checked) hasUpper = true;
//     if (lowercaseCheck.checked) hasLower = true;
//     if (numbersCheck.checked) hasNum = true;
//     if (symbolsCheck.checked) hasSym = true;

//         if (hasUpper && hasLower && (hasNum && hasSym) && passwordLength >= 8) 
//         {
//             setIndicator("#0f0");
//         } 
//         else if (
//             (hasLower || hasUpper) &&
//             (hasNum || hasSym) &&
//             passwordLength >= 6
//         )
//         {
//             setIndicator("#ff0"); 
//         }
//          else {
//             setIndicator("#f00");
//         }
// }


    function calcStrength() {
        let hasUpper = uppercaseCheck.checked;
        let hasLower = lowercaseCheck.checked;
        let hasNum = numbersCheck.checked;
        let hasSym = symbolsCheck.checked;

        // Conditions for strong password (green indicator)
        if (hasUpper && hasLower && hasNum && hasSym && passwordLength >= 8) {
            setIndicator("#0f0");  // Green for strong password
        }
        // Conditions for medium password (yellow indicator)
        else if ((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6) {
            setIndicator("#ff0");  // Yellow for medium password
        }
        // Weak password (red indicator)
        else {
            setIndicator("#f00");  // Red for weak password
        }
    }


  async function copyContent(){ 
     try{
            await navigator.clipboard.writeText(passwordDisplay.value);
            copyMsg.innerText = "copied";
    //copy the text on clipboard by using a method of clipboard i.e.writeText
      }
    catch(e){
        copyMsg.innerText = "Failed";
    } 

    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () =>{
     copyMsg.classList.remove("active");
     },2000);
    }

    function shufflePassword(array){
        //Fisher Yates method(an algorithm)
    for(let i = array.length - 1; i>0 ; i--){
    const j = Math.floor(Math.random() * (i+1));
    const temp = array[i];
    array[i]=array[j];
    array[j]= temp;
  }
  let str ="";
  array.forEach((el) =>(str += el));
  return str;
  }
 
  //kisi bhi checkbox ko tick krein ya na krein it will be checked whole again
      function handleCheckBoxChange(){
            checkCount = 0;
            allCheckBox.forEach((checkbox) => {
                if(checkbox.checked) checkCount++;
            });  
      
         //special condition
     if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();//update the slider UI
       }
       calcStrength();
    }

    allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change',handleCheckBoxChange);
    })

//    inputSlider.addEventListener('input',(e)=> {
//     passwordLength = e.target.value;
//      handleSlider();
//    })

    inputSlider.addEventListener('input', (e) => {
        passwordLength = parseInt(e.target.value);
        lengthDisplay.innerText = passwordLength;  // Display the current password length
        console.log("Password Length Updated:", passwordLength);  // Debugging
     });


    copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
        copyContent();
   })

   generateBtn.addEventListener('click', () => {
    //none of the checkboxes are selected 
    if (checkCount === 0) 
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Start password generation
    console.log("Starting the Journey");
    //remove old password
    password = "";
    // calcSrength();


    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbol);


    //cpmpulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory addition done");


    //remaining addition 
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex"+ randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining addition done");


    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI addition done");

    
    // Calculate strength
    calcStrength();
});
  

       
