
function validatePassword(password,errorText,formSubmit){
    
  let InputValue = document.getElementById(password).value;
  let regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*»/?()])(?=.{8,})");
  let regexSpecial = new RegExp("^(?=.*[!@#\$%\^&\*»/?()])");
  let errors = [];

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
