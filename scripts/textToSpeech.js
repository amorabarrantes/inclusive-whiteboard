import { newFormData, postJSON } from './helpers.js';
import { workflowCb } from './main.js';

let utter = new SpeechSynthesisUtterance();
let synth = window.speechSynthesis;

export async function readWorkflow() {
    const string = await getString();
    console.log(string.length);
    speak(string);
}

export function pause() {
    synth.pause();
}

export function resume() {
    synth.cancel();
}

function speak(text) {
    utter.lang = "en-En";
    utter.volume = 0.5;
    utter.onend = function () {
        console.log("termino de reproducir");
    };
    utter.onboundary = function (event) {
        console.log(event);
    }
    utter.text = text;
    synth.speak(utter);
}

async function getString() {
    let finalString = '';

    const states = {};

    const id_workflow = workflowCb.options[workflowCb.selectedIndex]?.dataset.id;

    //Search the current workflow information.
    const formData = newFormData({ id_workflow });
    const data = await postJSON(
        '../phps/read/tts.php',
        formData
    );

    //search the current workflow name
    finalString += `For the workflow named ${data[0].workflow_name}, you have the following information. `;

    //for each state, search each cards text
    data.forEach(({ state_name, card_text }) => {
        if (!states[state_name]) {
            states[state_name] = [card_text];
        } else {
            states[state_name] = [card_text, ...states[state_name]];
        }
    });

    //We iterate the states object to get cards of each state.
    Object.entries(states).forEach(entrie => {
        finalString += `for the state ${entrie[0]}, ${entrie[1][0] ? 'we got the following cards: ' : 'you have no cards.'}`;
        entrie[1].forEach(card => {
            if (card) finalString += `${card}. `;
        })
    });

    //Return the final string.
    return finalString;
}

utter.addEventListener('pause', function (event) {
    console.log(event);
    console.log('Speech paused after ' + event.elapsedTime / 1000 + ' seconds.');
});

