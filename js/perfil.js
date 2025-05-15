const dialogo = document.getElementById('miDialogo');

const btTurn = document.getElementById("bt_turn");
const close = document.getElementById("close");

btTurn.addEventListener("click", function() {
    dialogo.showModal();
});
close.addEventListener("click", function() {
    dialogo.close();
});