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
        valid_password.id = "valid_password";
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

        const valid_password = document.getElementById("valid_password");

        conteinerInput.removeChild(input_name);
        conteinerInput.removeChild(valid_password);
    }

  
});


//enviar informacion al servidor
const btLogin = document.querySelector("#login");

btLogin.addEventListener("click",()=>{

    const password = document.querySelector("input[type='password']");
    const email = document.querySelector("input[type='email']");

    if(button.textContent == "Iniciar Sesion"){
        if(password.value == "" || email.value == ""){
            alert("Por favor completa todos los campos");
        }
        else{

            const user={
                email: email.value,
                password: password.value
            }
            
            fetch("http://localhost:8080/barber/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            .then(response => {

                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                let token = response.headers.get("Authorization");
                localStorage.setItem("token",token);

                if(response.status == 401){
                    alert("Correo o contraseña incorrecta");
                }


                return response.json(); // Parsear la respuesta JSON
            })
            .then(data => {           
                console.log('Success:', JSON.stringify(data));
                // Aquí puedes manejar la respuesta de la API        
                
                localStorage.setItem("user",JSON.stringify(data));
                localStorage.setItem("showForm","false");
                window.location.replace('../html/perfil_admin.html');
            })
        }
    }
    else{
        const name = document.querySelector("input[type='text']");
        const valid_password = document.getElementById("valid_password");
        if(email.value == "" || password.value == "" || name.value == "" || valid_password.value == ""){
            alert("Por favor completa todos los campos");
        }
        else if(password.value == valid_password.value){

            const user={
                email: email.value,
                password: password.value,
                name: name.value
            }
            
            fetch("http://localhost:8080/barber/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            .then(response => {

                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                let token = response.headers.get("Authorization");
                localStorage.setItem("token",token);

                if(response.status == 409){
                    alert("El correo ya esta registrado");
                }


                return response.json(); // Parsear la respuesta JSON
            })
            .then(data => {           
                // Aquí puedes manejar la respuesta de la API        
                
                localStorage.setItem("user",JSON.stringify(data));
                localStorage.setItem("showForm","true");
                
                window.location.replace('../html/perfil_admin.html');
            })            


        }
        else{
            alert("Las contraseñas no coinciden");
        }
    }

})