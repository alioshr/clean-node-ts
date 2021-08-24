# Survey Results

> ## Success case

1. ⛔ Receives a **GET** request on route **/api/surveys/{survey_id}/results**
2. ⛔ Validates if the request has been made by a **user**
3. ⛔ Returns **200** with the survey data

> ## Exceptions

1. ⛔ Returns a **404** error if the API does not exist
2. ⛔ Returns a **403** error if request is not made by a user
3. ⛔ Returns a **500** error if an error occurs while trying to list the survey result