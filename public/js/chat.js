const socket = io()//client sde socket implementation

const $messageForm = document.querySelector('#msg-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
//templates
const msgTemplate = document.querySelector('#msg-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('message', (msg) => {
    console.log(msg);
    //rendering typed messages
    const html = Mustache.render(msgTemplate, { msg });
    $messages.insertAdjacentHTML('beforeend', html);//adding html in div
})

//handling sending location event separately [as location link needs to be url]
socket.on('locationMessage', (url) => {
    console.log(url);
    const loc = Mustache.render(locationTemplate, { url });
    $messages.insertAdjacentHTML('beforeend', loc)
})

//listening to event welcomeMsg sent by server
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //disbling send button to avoid resending same msg on multiple clicks
    $messageFormButton.setAttribute('disabled', 'disabled');
    const message = e.target.elements.msg.value; //getting input message
    socket.emit('sendMessage', message)//sending event to server with input
    //enabling the send button once previous msg is sent successfully
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = ''; //removing the msg from input
    $messageFormInput.focus();
})

//sharing location using geolocation API 
//[https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API]
document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert('geolocation doesnot supported by your browser')
    navigator.geolocation.getCurrentPosition((position) => {
        //sending location to server usuing sendlocation event
        $sendLocationButton.setAttribute('disabled', 'disabled');
        socket.emit('sendlocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {  //event acknowledgement using callback function
            console.log("Location Shared Successfully!");
        })
        $sendLocationButton.removeAttribute('disabled');
    })
})
