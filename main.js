//const { parse } = require("dotenv");

let hour = localStorage.getItem('hour') !== null ? parseInt(localStorage.getItem('hour')) : 0;
let minute = localStorage.getItem('minute') !== null ? parseInt(localStorage.getItem('minute')) : 0;
let second = localStorage.getItem('second') !== null ? parseInt(localStorage.getItem('second')) : 0;


let interval;
let countDown = localStorage.getItem('countDown') !== null ? localStorage.getItem('countDown') : false;
let counting = localStorage.getItem('counting') !== null ? localStorage.getItem('counting') : false;
const boxHour = document.getElementById('hour');
const boxMinute = document.getElementById('minute');
const boxSecond = document.getElementById('second');
const message = document.querySelector('.message-overlay')
const messageBtn = document.getElementById('message-btn');
const currentTime = new Date().toISOString(); // Get current time in ISO format
let pomodoro = JSON.parse(localStorage.getItem('pomodoro')) || {
    pomodoroStart: false,
    pomodoroStop: true,
    pomodoroCounting: false
};

//update display
setTimeout(() => {
    updateDisplay()
}, 500);

window.onload = function() {
    
    hour = localStorage.getItem('hour') !== null ? parseInt(localStorage.getItem('hour')) : 0;
    minute = localStorage.getItem('minute') !== null ? parseInt(localStorage.getItem('minute')) : 0;
    second = localStorage.getItem('second') !== null ? parseInt(localStorage.getItem('second')) : 0;
    countDown = localStorage.getItem('countDown') !== null ? localStorage.getItem('countDown') : false;
    localStorage.getItem('counting') = false;
    // Update your page elements or perform other actions
    updateDisplay();
};



//function to save time to local storage
function saveCurrentTime() {
    localStorage.setItem('second', second );
    localStorage.setItem('minute', minute );
    localStorage.setItem('hour', hour );
    localStorage.setItem('currentTime', currentTime);
    localStorage.setItem('pomodoro', JSON.stringify(pomodoro));
    localStorage.setItem('countDown', countDown);
    localStorage.setItem('counting', counting);
}


function checkTime() {
    if (second === 60) {
        second = 0;
        minute++;
    }
    if (minute === 60) {
        minute = 0;
        hour++;
    }
    if (hour === 24) {
        hour = 0;
    }
    updateDisplay();
}

function updateDisplay() {
    boxSecond.innerHTML = second < 10 ? `0${second}` : second;
    boxMinute.innerHTML = minute < 10 ? `0${minute}` : minute;
    boxHour.innerHTML = hour < 10 ? `0${hour}` : hour;
}

function toggleBtn() {
    console.log(counting)
    console.log(pomodoro.pomodoroStop)
    const displayStart = counting || !pomodoro.pomodoroStop ? 'none' : 'block';
    const displayStop = counting || !pomodoro.pomodoroStop ? 'block' : 'none';
    document.querySelector('.start-btn').style.display = displayStart;
    document.querySelector('.stop-btn').style.display = displayStop;
}

function reset() {
    clearInterval(interval);
    countDown = counting = pomodoro.pomodoroStart = pomodoro.pomodoroCounting = false;
    pomodoro.pomodoroStop = true;
    hour = minute = second = 0;
    //reset local storage
    localStorage.setItem('second', 0 );
    localStorage.setItem('minute', 0 );
    localStorage.setItem('hour', 0 );
    localStorage.setItem('currentTime', currentTime);
    localStorage.setItem('pomodoro', JSON.stringify(pomodoro));
    localStorage.setItem('countDown', countDown);
    localStorage.setItem('counting', counting);

    updateDisplay();
    document.getElementById('title').innerHTML = '';
    toggleBtn();
}

document.querySelector('.start-btn').addEventListener('click', () => {
    
    interval = setInterval(countDown ? countDownFun : timer, 1000);
    counting = true;
    toggleBtn();
});

function timer() {
    second++;
    checkTime();

    //save time to local storage
    saveCurrentTime();
}

document.querySelector('.stop-btn').addEventListener('click', () => {
    counting = false;
    if (pomodoro.pomodoroStart) {
        pomodoro.pomodoroCounting = false;
        pomodoro.pomodoroStop = true;
    }
    toggleBtn();
    clearInterval(interval);
    saveCurrentTime()
});

document.querySelector('.reset-btn').addEventListener('click', reset);

function countDownFun() {
    console.log('hello!')
    if (pomodoro.pomodoroStart) {
        pomodoro.pomodoroCounting = true;
        pomodoro.pomodoroStop = false;
    }

    if (second === 0 && minute > 0) {
        second = 59;
        minute--;
    } else if (minute === 0 && hour > 0) {
        minute = 59;
        hour--;
    }

    checkTime();
    second--;

    if (second === 0 && minute === 0 && hour === 0) {
        clearInterval(interval);
        updateDisplay();
        document.getElementById('title').innerHTML = 'Time is up!';
        let sound = new Audio('./hotel-bell-ding-1-174457.mp3');
        sound.play();
        setTimeout(reset, 5000);
    }
    saveCurrentTime();
}

document.querySelector('.set-btn').addEventListener('click', () => {
    reset();
    let newTime;
    countDown = counting = true;

    while (true) {
        newTime = prompt("Please enter time in minutes:");
        if (isNaN(newTime) || newTime.trim() === "") {
            alert("Invalid input. Please enter a number.");
        } else {
            break;
        }
    }

    if (newTime > 60) {
        minute = newTime % 60;
        hour = Math.floor(newTime / 60);
    } else {
        minute = newTime;
    }

    updateDisplay();
    interval = setInterval(countDownFun, 1000);
    toggleBtn();
});

document.getElementById('pomodoroButton').onclick = function() {
    if (pomodoro.pomodoroStart) {
        document.getElementById('title').style.color = 'red';
        document.getElementById('title').innerHTML = 'Reset the timer first!';
        return;
    }
    reset();
    pomodoro.pomodoroStart = countDown = counting = true;
    toggleBtn();
    minute =25
    interval = setInterval(countDownFun,1000)
    localStorage.setItem('pomodoro', JSON.stringify(pomodoro));
    saveCurrentTime()
}

//message advertising
setTimeout(() => {
    message.style.display = 'block'
}, 9000);

//close message
messageBtn.onclick = function() {
    message.style.display = 'none'
}

