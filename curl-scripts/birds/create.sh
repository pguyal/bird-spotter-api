# TOKEN= NAME="Blue Jay" SPECIES="Cyanocitta cristata" LOCATION="Patuxent River Park, Upper Marlboro" sh curl-scripts/birds/create.sh

API="http://localhost:4741"
URL_PATH="/birds"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
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
