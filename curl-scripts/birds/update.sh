# TOKEN= ID= NAME="" SPECIES="" LOCATION="" sh curl-scripts/birds/update.sh

API="http://localhost:4741"
URL_PATH="/birds"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "bird": {
      "name": "'"${NAME}"'",
      "species": "'"${SPECIES}"'",
      "location": "'"${LOCATION}"'"
    }
  }'

echo
