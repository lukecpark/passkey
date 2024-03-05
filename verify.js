const { generateAuthenticationOptions, verifyAuthenticationResponse, generateRegistrationOptions, verifyRegistrationResponse } = require('@simplewebauthn/server');
const { isoBase64URL } = require('@simplewebauthn/server/helpers');

let users = {}; // This would ideally be a database in a real application // TODO
// let authenticators = {}; // Store authenticator data securely in a real application

exports.startRegistration = async (req, res) => {
    const { username } = req.body;
    const userExists = users[username];
    if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Change challenge into hash
    // Temporal hash
    // TODO
    const tmpChallenge = "0x548904fb89e03933d35aa68c0ea05ae12037c65677d154e2846c217558105311";

    const options = await generateRegistrationOptions({
        rpName: 'Example Corp',
        rpID: 'localhost',
        userID: username,
        userName: username,
        userDisplayName: username,
        challenge: tmpChallenge,
    });

    // Store options in session or a temporary store
    users[username] = { registrationOptions: options };

    res.json(options);
};

exports.finishRegistration = (req, res) => {
    const { username, credential } = req.body;
    const user = users[username];

    // Change challenge into hash
    // Temporal hash
    const expectedChallenge = isoBase64URL.fromString(
        "0x548904fb89e03933d35aa68c0ea05ae12037c65677d154e2846c217558105311"
    );
    // const expectedChallenge = user.registrationOptions.challenge;
    console.log(expectedChallenge);
    console.log(credential.id);

    try {
        const verification = verifyRegistrationResponse({
            response: credential,
            expectedChallenge,
            expectedOrigin: 'http://localhost:3000',
            expectedRPID: 'localhost',
        });

        if (verification.verified) {
            authenticators[username] = {
                credentialID: credential.id,
                publicKey: verification.registrationInfo.credentialPublicKey,
                counter: verification.registrationInfo.counter,
            };
            return res.json({ success: true });
        }

        console.log("Registration Done!");
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.listRegistration = (req, res) => {
    res.json(users); // Send the users object as a JSON response
}

// exports.startAuthentication = (req, res) => {
//     const { username } = req.body;
//     const user = authenticators[username];
//     if (!user) {
//         return res.status(400).json({ error: 'User does not exist' });
//     }

//     const options = generateAuthenticationOptions({
//         allowCredentials: [{
//             id: user.credentialID,
//             type: 'public-key',
//         }],
//         userVerification: 'preferred',
//     });

//     // Store options in session or a temporary store
//     users[username].authenticationOptions = options;

//     res.json(options);
// };

// exports.finishAuthentication = (req, res) => {
//     const { username, credential } = req.body;
//     const user = users[username];
//     const authenticator = authenticators[username];

//     try {
//         const verification = verifyAuthenticationResponse({
//             credential,
//             expectedChallenge: user.authenticationOptions.challenge,
//             expectedOrigin: 'http://localhost:3000',
//             expectedRPID: 'localhost',
//             authenticator: {
//                 counter: authenticator.counter,
//                 credentialID: authenticator.credentialID,
//                 credentialPublicKey: authenticator.publicKey,
//             },
//         });

//         if (verification.verified) {
//             // Update the authenticator's counter
//             authenticators[username].counter = verification.authenticationInfo.newCounter;
//             return res.json({ success: true });
//         }
//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// };
