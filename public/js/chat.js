const socket = io()//client sde socket implementation

socket.on('message', (msg) => {
    console.log(msg);
})
//listening to event welcomeMsg sent by server
document.querySelector('#msg-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.msg.value; //getting input message
    socket.emit('sendMessage', message)//sending event to server with input
})

//sharing location using geolocation API 
//[https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API]
document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert('geolocation doesnot supported by your browser')
    navigator.geolocation.getCurrentPosition((position) => {
        //sending location to server usuing sendlocation event
        socket.emit('sendlocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })

    })
})
