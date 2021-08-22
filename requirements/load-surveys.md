# Listar enquetes

> ## Success cases

1. ⛔ Receives a **GET** request on route **/api/surveys**
2. ⛔ Validates if the request has been made by a **user**
3. ⛔ Returns **204** if there it no survey
4. ⛔ Returns **200** with the survey data

> ## Exceptions

1. ⛔ Returns **404** if the API does not exist
2. ⛔ Returns **403** if the request is not made by a user
3. ⛔ Returns **500** if an error occurs while trying to list surveys