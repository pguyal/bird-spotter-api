# TOKEN= sh curl-scripts/birds/index-all.sh

API="http://localhost:4741"
URL_PATH="/birds-all"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
