let nameString = "";
let ageString = "";
let topicString = "";
let promptString = "";
let currentStory = ""
function scrollToBottom() {
    window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
}
function simulateTyping({element, text, onComplete}) {
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            if (text.charAt(i) === "<" && text.charAt(i + 1) === "b" && text.charAt(i + 2) === "r" && text.charAt(i + 3) === ">") {
                element.innerHTML += "<br>";
                i += 4;
            } else {
                element.innerHTML += text.charAt(i);
                i++;
            }
            scrollToBottom();
        } else {
            clearInterval(interval);
            onComplete();
            scrollToBottom();
        }
    }, 15);
}
function increaseSize(event, bTarget, autoInput = true) {
    if (autoInput) {event.target.style.width = (event.target.value.length + 1) * 14 + 'px';}
    if (event.target.value.trim() !== "") {
        document.querySelector(bTarget).style.display = 'block';
    } else {
        document.querySelector(bTarget).style.display = 'none';
    }
}
function checkEnter(event, func) {
    if (event.key === 'Enter') {
        if (event.target.value.trim() === "") {
            alert("PROVIDE TEXT");
        } else {
            if (event.target.id === "age" && !(/^\d+$/.test(event.target.value))) {
                alert("AGE MUST BE A NUMBER");
            } else {
                func();
            }
        }
    }
}
simulateTyping({
    element: document.querySelector('#p1'),
    text: "👋 Hi! Let's go on an adventure together! What's your name?",
    onComplete: () => {
        document.querySelector('#name').style.display = 'inline-block';
        document.querySelector('#name').focus();
    }
});
function nextOption1() {
    nameString = document.querySelector('#name').value;
    currentStory += `USER NAME: ${nameString}`;
    document.querySelector('#name').disabled = true;
    document.querySelector('#b1').style.display = 'none';
    simulateTyping({
        element: document.querySelector('#p2'),
        text: `🎂 Nice to meet you, ${nameString}! Before we start, how old are you?`,
        onComplete: () => {
            document.querySelector('#age').style.display = 'inline-block';
            document.querySelector('#age').focus();
        }
    });
}
function nextOption2() {
    ageString = document.querySelector('#age').value;
    currentStory += `; USER AGE: ${ageString}`;
    document.querySelector('#age').disabled = true;
    document.querySelector('#b2').style.display = 'none';
    simulateTyping({
        element: document.querySelector('#p4'),
        text: `📚 Great! What subject, specific or general, do you need work in?`,
        onComplete: () => {
            document.querySelector('#topic').style.display = 'inline-block';
            document.querySelector('#topic').focus();
        }
    });
}
function nextOption4() {
    topicString = document.querySelector('#topic').value;
    currentStory += `; FOCUS SUBJECT: ${topicString}`;
    document.querySelector('#topic').disabled = true;
    document.querySelector('#b4').style.display = 'none';
    simulateTyping({
        element: document.querySelector('#p3'),
        text: `🌱 Coolio! ${topicString} is a fantastic topic! One last thing—what do you want your story to be about?`,
        onComplete: () => {
            document.querySelector('#prompt').style.display = 'inline-block';
            document.querySelector('#prompt').focus();
        }
    })
}
function nextOption3() {
    promptString = document.querySelector('#prompt').value;
    currentStory += `; USER PROMPT: ${promptString}.\n\n`;
    document.querySelector('#preStory').style.display = 'none';
    document.querySelector('#mainStory').style.display = 'block';
    genGPT();
}
let k = 0;
let jsonData;
function genGPT() {
    document.querySelector("#mainStory").innerHTML += `<span id="loading">Loading...</span>`;
    scrollToBottom();
    fetch("/gpt/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: currentStory
        }),
    })
    .then(response => response.json())
    .then(data => {
        jsonData = data;
        nextQuestion();
    }).catch(error => {console.log(error); alert("Error generating story. Please reload and check console for error");});
}
function nextQuestion() {
    k++;
    currentStory += jsonData["Story"];
    document.querySelector("#loading").remove();
    document.querySelector("#mainStory").innerHTML += `
<span id="s${k}"></span><hr id="h${k}" style="display: none"/>
<i style="display: none" id="q${k}" class="q"></i>
<center id="qo${k}"></center>
    `;
    const options = ["A", "B", "C", "D"];
    const randomOptions = options.sort(() => Math.random() - 0.5);
    for (let i = 0; i < randomOptions.length; i++) {
        const option = randomOptions[i];
        document.querySelector(`#qo${k}`).innerHTML += `<button class="sb${k} sb ${option.toLowerCase()}" style="display: none" onClick="submitAnswer('${option}')">${jsonData[`Option${option}`]}</button>`;
    }
    simulateTyping({
        element: document.querySelector(`#s${k}`),
        text: jsonData['Story'].replace(/(?<!<br><br>)(")(?=[A-Za-z])/g, '<br><br>$1'),
        onComplete: () => {
            document.querySelector(`#h${k}`).style.display = 'block';
            document.querySelector(`#q${k}`).style.display = 'block';
            simulateTyping({
                element: document.querySelector(`#q${k}`),
                text: jsonData['Question'],
                onComplete: () => {
                    document.querySelectorAll(`.sb${k}`).forEach(el => {el.style.display = 'inline-block';});
                }
            });
        }
    });
}
function submitAnswer(option) {
    document.querySelectorAll(`.sb${k}`).forEach(el => {el.disabled = true;});
    let message;
    let optionA;
    let optionB;
    if (option === jsonData['Right_Answer_Letter']) {
        message = `Correct! ${jsonData['Right_Answer_Explanation']}`;
        optionA = jsonData['Good_Story_Option1'];
        optionB = jsonData['Good_Story_Option2'];
    } else {
        message = `Incorrect! ${jsonData['Right_Answer_Explanation']}`;
        optionA = jsonData['Bad_Story_Option1'];
        optionB = jsonData['Bad_Story_Option2'];
    }
    document.querySelector("#mainStory").innerHTML += `
<i><span id="a${k}" class="q" style="display: block"></span></i>
<center><button class="o${k} sb e" style="display: none" onclick="submitOption(this.innerText)">${optionA}</button>
<button class="o${k} sb f" style="display: none" onclick="submitOption(this.innerText)">${optionB}</button></center>
    `;
    simulateTyping({
        element: document.querySelector(`#a${k}`),
        text: message,
        onComplete: () => {
            document.querySelectorAll(`.o${k}`).forEach(el => {el.style.display = 'inline-block';});
        }
    });
}
function submitOption(prompt) {
    document.querySelectorAll(`.o${k}`).forEach(el => {el.disabled = true;});
    document.querySelector("#mainStory").innerHTML += `<hr>`;
    currentStory += `\n\nCONTINUE STORY THE USER SAID: ${prompt}`;
    console.log(currentStory);
    genGPT(currentStory);
}