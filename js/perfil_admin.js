const dialogo = document.getElementById('miDialogo');

const btModi = document.getElementById("bt_modi");
const close = document.getElementById("close");

btModi.addEventListener("click", function() {
    dialogo.showModal();
});
close.addEventListener("click", function() {
    dialogo.close();
});