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

    const userLogin=JSON.parse(localStorage.getItem("user"));

    fetch("http://localhost:8080/barber/"+userLogin.id,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parsear la respuesta JSON
    })
    .then(data => {           
        // Aquí puedes manejar la respuesta de la API    
        let user = data;        
        if(localStorage.getItem("showForm") == "true"){

            //rellenar campos automaticamente
            const input_name_dialog = document.getElementById("name");
            input_name_dialog.value= user.name;
            dialogo.showModal();
            localStorage.setItem("showForm","false");
        }
        else{
            const user_all_info=user;

            let txt_name = document.getElementById("txt_name");
            let txt_price = document.getElementById("txt_price");
            let txt_score = document.getElementById("txt_score");
            let txt_address = document.getElementById("txt_address");
            let txt_number_clients = document.getElementById("txt_number_clients");
            let selectStatus = document.getElementById("select_status");            

            selectStatus.value = user_all_info.status;
            txt_name.textContent=user_all_info.name;
            txt_price.textContent=user_all_info.price;
            txt_score.textContent=user_all_info.score;
            txt_address.textContent=user_all_info.address+", "+user_all_info.neighborhood;
            
            

            let clients = new Array();
            clients = user_all_info.clients; 
            txt_number_clients.textContent=clients.length;

            //cargar lista de turnos
            updateListTurnos(clients); 
            
            

            //actulizar lista de turno en tiempo real
            const socket = new SockJS("http://localhost:8080/ws");
            const stompClient = Stomp.over(socket); 
            
            stompClient.connect({}, function(frame) {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/barber/'+user_all_info.id, function(message) {
                    let turnos = JSON.parse(message.body);
                    localStorage.setItem("turnos",JSON.stringify(turnos));
                    updateListTurnos(turnos);
                });

                

            });
        }        

    })








});


//cambiar estado del barbero
const selectStatus = document.getElementById("select_status");

selectStatus.addEventListener("change", function() {
    const valorSeleccionado = selectStatus.value;
    let token= "Bearer " + localStorage.getItem("token");

    fetch("http://localhost:8080/barber/changeStatus/"+valorSeleccionado, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': token
        },
        
    })
    .then(response => {

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        
    })

});

//boton de siguente
const btSiguiente = document.getElementById("bt_turn");

btSiguiente.addEventListener("click", function() {

    let turns = JSON.parse(localStorage.getItem("turnos"));

    let client = turns[0];

    fetch("http://localhost:8080/barber/deleteClient/"+client.id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(response => {

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        //return response.json(); // Parsear la respuesta JSON
    })

});

//rellenando informacion de la pagina(lista de turnos)

function updateListTurnos(turnos){
    let list_turnos = document.getElementById("list_clients_turn");
    let txt_number_clients = document.getElementById("txt_number_clients");
    txt_number_clients.textContent=turnos.length;
    list_turnos.innerHTML = "";
    turnos.forEach(turno => {
        let li = document.createElement("li");
        li.textContent = turno.name;
        list_turnos.appendChild(li);
    });
}


//cerrar sesion

const btCloseSession = document.getElementById("bt_close_session");

btCloseSession.addEventListener("click",function(){

    localStorage.removeItem("token");
    window.location.replace('../html/login.html');
})