# Reply survey

> ## Success Cases

1. ⛔ Receives a **PUT** request on route **/api/surveys/{survey_id}/results**
2. ⛔ Validates if the request has been made by a **user**
3. ⛔ Validates the param **survey_id**
4. ⛔ Validates if the **answer** field is valid
5. ⛔ **Creates** a survey result with the provided data in case there are no records
6. ⛔ **Updates** a survey result with the provided data in case there are records
7. ⛔ Returns **200** with the survey result

> ## Exceptions

1. ⛔ Returns **404** if the API does not exist Retorna erro **404** se a API não existir
2. ⛔ Returns **403** if the request is not made by a user
3. ⛔ Returns **403** if the survey_id passed as a URL query param is not valid
4. ⛔ Returns **403** if the answer provided by the client is invalid
5. ⛔ Returns **500** if an error occurs while trying to create the survey result
6. ⛔ Returns **500** if an error occurs while trying to update the survey result
7. ⛔ Returns **500** if an error occurs while trying to load the survey