let tmpCredential = null; // Temporary storage for the credential // TODO

document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('register');
    const finishRegistrationButton = document.getElementById('finishRegistration');
    // const loginButton = document.getElementById('login');

    const usernameInput = document.getElementById('username');

    registerButton.addEventListener('click', () => startRegistration(usernameInput.value));
    finishRegistrationButton.addEventListener('click', () => finishRegistration(usernameInput.value, tmpCredential));
    // loginButton.addEventListener('click', () => startAuthentication(usernameInput.value));
});

async function startRegistration(username) {
    const optionsResponse = await fetch('/register/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });
    const options = await optionsResponse.json();

    options.challenge = bufferDecode(options.challenge);
    options.user.id = bufferDecode(options.user.id);
    if (options.excludeCredentials) {
        options.excludeCredentials.forEach(cred => cred.id = bufferDecode(cred.id));
    }

    const credential = await navigator.credentials.create({ publicKey: options });
    tmpCredential = credential;

    // await finishRegistration(username, credential);

    // Show the "Finish Registration" button
    document.getElementById('finishRegistration').style.display = 'inline';
}

async function finishRegistration(username, credential) {
    if (!credential) {
        console.error('No credential available for finishing registration.');
        return;
    } else {
        console.log("credential:", credential);
        console.log(credential.id);
    }

    const credentialData = {
        // id: credential.id,
        id: credential.id,
        rawId: bufferEncode(credential.rawId),
        type: credential.type,
        response: {
            attestationObject: bufferEncode(credential.response.attestationObject),
            clientDataJSON: bufferEncode(credential.response.clientDataJSON),
        },
    };

    await fetch('/register/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, credential: credentialData }),
    });

    // After finishing registration, you may hide the button again or reset the state as needed
    document.getElementById('finishRegistration').style.display = 'none';
    tmpCredential = null; // Clear the temporary storage
}

// async function startAuthentication(username) {
//     const optionsResponse = await fetch('/auth/start', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username }),
//     });
//     const options = await optionsResponse.json();

//     options.challenge = bufferDecode(options.challenge);
//     if (options.allowCredentials) {
//         options.allowCredentials.forEach(cred => cred.id = bufferDecode(cred.id));
//     }

//     const assertion = await navigator.credentials.get({ publicKey: options });

//     await finishAuthentication(username, assertion);
// }

// async function finishAuthentication(username, assertion) {
//     const assertionData = {
//         id: assertion.id,
//         rawId: bufferEncode(assertion.rawId),
//         type: assertion.type,
//         response: {
//             authenticatorData: bufferEncode(assertion.response.authenticatorData),
//             clientDataJSON: bufferEncode(assertion.response.clientDataJSON),
//             signature: bufferEncode(assertion.response.signature),
//             userHandle: assertion.response.userHandle ? bufferEncode(assertion.response.userHandle) : null,
//         },
//     };

//     await fetch('/auth/finish', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, credential: assertionData }),
//     });
// }

function bufferEncode(value) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(value)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

function bufferDecode(value) {
    return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}
