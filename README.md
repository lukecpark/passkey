# Get List of Registration Users (via curl)

```bash
$ curl http://localhost:3000/register/list

{"elvkdlee":{"registrationOptions":{"challenge":"MHg1NDg5MDRmYjg5ZTAzOTMzZDM1YWE2OGMwZWEwNWFlMTIwMzdjNjU2NzdkMTU0ZTI4NDZjMjE3NTU4MTA1MzEx","rp":{"name":"Example Corp","id":"localhost"},"user":{"id":"elvkdlee","name":"elvkdlee","displayName":"elvkdlee"},"pubKeyCredParams":[{"alg":-8,"type":"public-key"},{"alg":-7,"type":"public-key"},{"alg":-257,"type":"public-key"}],"timeout":60000,"attestation":"none","excludeCredentials":[],"authenticatorSelection":{"residentKey":"preferred","userVerification":"preferred","requireResidentKey":false},"extensions":{"credProps":true}}}}
```
