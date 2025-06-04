
const conteinerBarber = document.querySelector(".conteiner_barbers");

document.addEventListener("DOMContentLoaded", function() {

    fetch("http://localhost:8080/barber/all", {
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
        conteinerBarber.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos elementos
        data.forEach(barber => {
            const barberCard = document.createElement("div");
            barberCard.classList.add("barber");
            
            barberCard.dataset.id =barber.id // Agregar el ID del barbero como atributo de datos
            barberCard.innerHTML = `
                <div class="conteiner_img">
                    <img src="${barber.photo != null? barber.photo: '../img/sin_usuario.jpeg'}" alt="">
                </div>
                    <div class="conteiner_info">
                    <h2>${barber.name}</h2>
                    <p>Corte $${barber.price}</p>                                        
                </div>

                <div class="buttons">
                    <button>Conocer</button>   
                </div>
            `;
            

            //agregar evento
            barberCard.addEventListener("click", (e) => {
                const id = e.currentTarget.dataset.id;

                localStorage.setItem("barberId", id); // Guardar el ID del barbero en localStorage
                window.location.href = "../html/perfil_barber.html"; // Redirigir a la página de perfil del barbero


                console.log("ID del barbero:", id);
            });

            conteinerBarber.appendChild(barberCard);
        });
    })
    .catch(error => {
        console.error("Error:", error);
    });



})

