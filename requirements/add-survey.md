# Create a Survey

> ## Success case

1. ✅ Receives a ***POST*** request on route **/api/surveys**
2. ✅ Validates if the request has been made by an **admin**
3. ✅ Validates required data **question** & **answers**
4. ✅ **Creates** a survey with the provided data
5. ✅ Returns **204**, without data

> ## Exceptions 

1. ✅ Returns a **404** error if the API does not exist
2. ✅ Returns a **403** error if the user is not an Admin
3. ✅ Returns a **400** error if question or answers are not provided by the client
4. ✅ Returns a **500** error if a server error occurs while trying to create a survey