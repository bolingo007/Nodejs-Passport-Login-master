
function validatePassword(password,errorText,formSubmit){
    
   let InputValue = document.getElementById(password).value;
   let regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*»/?()])(?=.{8,})");
   let regexSpecial = new RegExp("^(?=.*[!@#\$%\^&\*»/?()])");
   let errors = [];
  // document.getElementById(passwordText).innerHTML = "Password value:- "+InputValue;

    if (InputValue.length < 8) {
        errors.push("Le mot de passe doit avoir au moins 8 caractères."); 
    }
    if (InputValue.search(/[a-z]/) < 0) {
        errors.push("Le mot de passe doit avoir au moins une lettre minuscule.");
    }
    if (InputValue.search(/[A-Z]/) < 0) {
        errors.push("Le mot de passe doit avoir au moins une lettre majuscule.");
    }
    if (InputValue.search(/[0-9]/) < 0) {
        errors.push("Le mot de passe doit avoir au moins un chiffre."); 
    }
    if (!regexSpecial.test(InputValue)) {
        errors.push("Le mot de passe doit avoir au moins un caractère spécial."); 
    }
    if (errors.length > 0) {
        document.getElementById(errorText).innerHTML = errors.join("<br/>");
        return false;
    }

   if(!regex.test(InputValue)) {
        document.getElementById(errorText).innerHTML = "Invalid Password";
        return false;
   } else{
        document.getElementById(errorText).innerHTML = "";
        document.getElementById(formSubmit).submit();
        return true;
   }
}

/*
function validatePassword(password,passwordText,errorText){
    
   let InputValue = document.getElementById(password).value;
   let regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
   document.getElementById(passwordText).innerHTML = "Password value:- "+InputValue;

     if(!regex.test(InputValue)) {
        document.getElementById(errorText).innerHTML = "Invalid Password";
     }
     else{
        document.getElementById(errorText).innerHTML = "";
     }
}
*/
/*
function validatePassword(){
    
   let InputValue = document.getElementById('password').value;
   let regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
   document.getElementById('passwordText').innerHTML = "Password value:- "+InputValue;

     if(!regex.test(InputValue)) {
        document.getElementById('error').innerHTML = "Invalid Password";
     }
     else{
        document.getElementById('error').innerHTML = "";
     }
}
*/
 /*sdSD14$47&%@
function validatePassword(){
    
   let InputValue = $("#password").val();
   let regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
     $("#passwordText").text(`Password value:- ${InputValue}`);
     
     if(!regex.test(InputValue)) {
          $("#error").text("Invalid Password");
     }
     else{
           $("#error").text("");
     }
 }

 */
