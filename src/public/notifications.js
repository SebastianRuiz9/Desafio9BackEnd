


function showNotification(text){
    Toastify({
        text: text,
        duration: 3000, // Duración de la notificación en milisegundos
        close: true, // Opción para permitir que el usuario cierre la notificación
        gravity: "top", // Posición de la notificación (top, bottom, left, right)
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)" // Color de fondo de la notificación
    }).showToast();
    
}


