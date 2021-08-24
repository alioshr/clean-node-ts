# Sign Up

> ## Success Cases

1. ✅ Receives a **POST** request on route **/api/signup**
2. ✅ Validates the required fields **name**, **email**, **password** & **passwordConfirmation**
3. ✅ Validates that **password** & **passwordConfirmation** are equal
4. ✅ Validates that the **email** field is a valid email
5. ⛔ **Validates** if the user already exists
6. ✅ Generates an **encrypted** password which cannot be decrypted
7. ✅ **Creates** a user account with the provided data, **replacing** the password for an encrypted password
8. ✅ Generates an access **token** with the user ID and email
9. ✅ **Updates** the user data with the generated access token
10. ✅ Returns **200** with the generated access token + user id

> ## Exceptions

1. ⛔ Returns **404** if the API does not exist
2. ✅ Returns **404** if name, email, password or passwordConfirmation are not provided
3. ✅ Returns **404** if password and passwordConfirmation do not match
4. ✅ Returns **404** if the provided email is invalid
5. ⛔ Returns **403** if the provided email is already in use (user exists)
6. ✅ Returns **500** if an error occurs while trying to generate an encrypted password
7. ✅ Returns **500** if an error occurs while trying to save/load an account
8. ✅ Returns **500** if an error occurs while trying to generate an access token
9. ✅ Returns **500** if an error occurs while trying to update the user account with the generate access token