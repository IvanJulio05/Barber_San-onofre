const dialogo = document.getElementById('miDialogo');

const btModi = document.getElementById("bt_modi");
const close = document.getElementById("close");

btModi.addEventListener("click", function() {

    const user=JSON.parse(localStorage.getItem("user"));
    const input_name = document.getElementById("name");
    const input_price = document.getElementById("price");
    const input_nighborhood = document.getElementById("barrio");
    const input_address = document.getElementById("direccion");
    input_name.value= user.name;
    input_price.value= user.price;
    input_nighborhood.value= user.neighborhood;
    input_address.value= user.address;
    //rellenar campos automaticamente

    dialogo.showModal();
});
close.addEventListener("click", function() {
    
    const input_name = document.getElementById("name");
    const input_price = document.getElementById("price");
    const input_nighborhood = document.getElementById("barrio");
    const input_address = document.getElementById("direccion");
    let token= "Bearer " + localStorage.getItem("token");
    if(input_name.value == "" || input_price.value == "" || input_nighborhood.value == ""){
        alert("Por favor completa todos los campos");

    }
    else{

        const user=JSON.parse(localStorage.getItem("user"));
        const userUpdate={
            name: input_name.value,
            email: user.email,
            price: input_price.value,
            neighborhood: input_nighborhood.value,
            address: input_address.value
        }
        //enviar informacion al servidor

        fetch("http://localhost:8080/barber/update/"+user.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': token
            },
            body: JSON.stringify(userUpdate)
        })
        .then(response => {

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }


            return response.json(); // Parsear la respuesta JSON
        })
        .then(data => {           
            // Aquí puedes manejar la respuesta de la API        
            
            localStorage.setItem("user",JSON.stringify(data));
            
            location.reload();
        })   



        dialogo.close();
    }
    
});


document.addEventListener("DOMContentLoaded", function() {

    const user=JSON.parse(localStorage.getItem("user"));
    if(localStorage.getItem("showForm") == "true"){

        //rellenar campos automaticamente
        const input_name_dialog = document.getElementById("name");
        input_name_dialog.value= user.name;
        dialogo.showModal();
        localStorage.setItem("showForm","false");
    }
    else{
        const user_all_info=JSON.parse(localStorage.getItem("user"));

        let txt_name = document.getElementById("txt_name");
        let txt_price = document.getElementById("txt_price");
        let txt_score = document.getElementById("txt_score");
        let txt_address = document.getElementById("txt_address");
        let txt_number_clients = document.getElementById("txt_number_clients");

        txt_name.textContent=user_all_info.name;
        txt_price.textContent=user_all_info.price;
        txt_score.textContent=user_all_info.score;
        txt_address.textContent=user_all_info.address+", "+user_all_info.neighborhood;
        //txt_number_clients.textContent=user_all_info.clients.length;
        console.log(user_all_info);
    }


    //rellenando informacion de la pagina



});
