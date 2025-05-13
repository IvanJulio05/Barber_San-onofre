const createAccountButton = document.getElementById("create-account-button");

const conteinerInput = document.querySelector(".conteiner_inputs");

const button = document.querySelector("#login");

createAccountButton.addEventListener("click", () => {
  console.log("click");
    if(button.textContent == "Iniciar Sesion"){
        button.textContent = "Crear Cuenta";
        createAccountButton.textContent = "Iniciar Sesion";
        const input_name = document.createElement
        ("input");
        const valid_password = document.createElement("input");
        valid_password.placeholder = "Confirmar Contraseña";
        valid_password.type = "password";
        valid_password.required = true;
        input_name.placeholder = "Nombre";
        input_name.type = "text";
        input_name.required = true;
        conteinerInput.prepend(input_name);  
        conteinerInput.insertBefore(valid_password, document.querySelector("button"));      
    }
    else{
        button.textContent = "Iniciar Sesion";
        createAccountButton.textContent = "Crear Cuenta";
        const input_name = document.querySelector("input[type='text']");
        conteinerInput.removeChild(input_name);
    }

  
});