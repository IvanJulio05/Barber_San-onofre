const dialogo = document.getElementById('miDialogo');

const btTurn = document.getElementById("bt_turn");
const close = document.getElementById("close");

btTurn.addEventListener("click", function() {
    dialogo.showModal();
});
close.addEventListener("click", function() {
    const statustxt = document.getElementById("txt_status");
    
    if(statustxt.textContent == "Activo"){
        const inputName = document.getElementById("name_dialog");
        if(inputName.value != ""){

            let client = {
                name:inputName.value,
                idBarber: localStorage.getItem("barberId")
            }
            
            fetch("http://localhost:8080/barber/addClient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body:JSON.stringify(client)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.status);
                }
                return response.json();
            })
            .then(data =>{

                localStorage.setItem("idClient",data.id);
            })   
            dialogo.close();
        }
        else{
            dialogo.close();
        }


    }
    else{
        dialogo.close();
        alert("El Barbero no esta trabajando");
    }



    
});

fetch("http://localhost:8080/barber/"+localStorage.getItem("barberId"), {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
    }
    return response.json(); // Parsear la respuesta JSON
})
.then(data => {
    // Aquí puedes manejar la respuesta de la API
    const barber = data;

    UpdateBarber(barber);

    //cargar lista de turnos 
    
    //localStorage.setItem("turnos",JSON.stringify(clients));
    

    //actulizar lista de turno en tiempo real
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);     
    stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/barber/'+barber.id, function(message) {
            let turnos = JSON.parse(message.body);
            //localStorage.setItem("turnos",JSON.stringify(turnos));
            updateListTurnos(turnos);
        });

        
        stompClient.subscribe('/topic/barber/update/'+barber.id, function(message) {
            let barber = JSON.parse(message.body);
            
            UpdateBarber(barber);            
        });

        // Suscribirse al canal de status del barbero
        stompClient.subscribe('/topic/barber/changeStatus'+barber.id, function(message) {            
            let select_status = document.getElementById("txt_status");

            if(message.body == "Pausa"){
                select_status.textContent ="Pausa";
                select_status.style.color = "red";                
            }
            else{
                select_status.textContent ="Activo";
                select_status.style.color = "rgb(1, 255, 1)";  
            }
            
        });
    });
})

function updateListTurnos(turnos){
    let idClient = localStorage.getItem("idClient");
    let list_turnos = document.getElementById("list_clients_turn");
    let txt_number_clients = document.getElementById("txt_number_clients");
    txt_number_clients.textContent=turnos.length;
    list_turnos.innerHTML = "";
    console.log("valor de idClient = "+idClient);
    turnos.forEach(turno => {
        let li = document.createElement("li");
        console.log(console.log("valor de id turno: "+turno.id));
        if(turno.id == idClient){
            li.textContent = turno.name+" (YO)";
        }
        else{
            li.textContent = turno.name;
        }        
        list_turnos.appendChild(li);
    });
}

function UpdateBarber(barber){

    let txt_name = document.getElementById("txt_name");
    let txt_price = document.getElementById("txt_price");
    let txt_score = document.getElementById("txt_score");
    let txt_address = document.getElementById("txt_address");
    let txt_number_clients = document.getElementById("txt_number_clients");
    let txt_status = document.getElementById("txt_status");

    txt_name.textContent= barber.name;
    txt_price.textContent= barber.price;
    txt_address.textContent=barber.address+", "+barber.neighborhood;
    txt_score.textContent=barber.score;
    txt_status.textContent=barber.status;
    if(barber.status == "PAUSA"){
        txt_status.style.color = "red";
    }
    
    let clients = new Array();
    clients = barber.clients; 
    txt_number_clients.textContent=clients.length;

    updateListTurnos(clients);
}



