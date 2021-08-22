# Login

> ## Success Case

1. ✅ Receives a **POST** request on route **/api/login**
2. ✅ Validates required data **email** & **password**
3. ✅ Validates if **email** is valid
4. ✅ **Gets** the user data with the provided **email** & **password**
5. ✅ Generates an access **token** with the user ID & email
6. ✅ **Updates** the user data with the generated access token
7. ✅ Returns **200** with the access token & the username

> ## Exceptions

1. ⛔ Returns **404** if the API does not exist
2. ✅ Returns **400** if the email or password are not provided by the client
3. ✅ Returns **400** if the provided email is invalid
4. ✅ Returns **401** if no user is found with the provided data / invalid credentials
5. ✅ Returns **500** if an error occurs while trying to generate an access token
6. ✅ Returns **500** if an error occurs while trying to update the user data with the provided token