#!/bin/bash

MAILHOST=localhost
CONF_CONFIG=/opt/zimbra/zimlets-deployed/com_wog_confrooms/js/calendars.json
CONF_CONFIG_TMP=$CONF_CONFIG.tmp

echo > $CONF_CONFIG_TMP
while read line; do
  if [[ $line =~ "username" ]]; then
   username=$(echo $line | cut -d':' -f 2 | cut -d',' -f 1 | sed 's/[[:blank:]]*$//' | sed 's/^[[:blank:]]*//' | awk -F'"' '{print $2}')
#   echo "$username"
  fi
  if [[ $line =~ "userPass" ]]; then
   userPass=$(echo $line | cut -d':' -f 2 | cut -d',' -f 1 | sed 's/[[:blank:]]*$//' | sed 's/^[[:blank:]]*//' | awk -F'"' '{print $2}')
#   echo "$userPass"
  fi
  if ! [ -z "$username" ] 2> /dev/null && ! username[ -z "$username" ] 2> /dev/null && [[ $line =~ "userToken" ]]; then
    token=$(curl --user "$username:$userPass" -k "https://$MAILHOST/home/$username/Inbox/?fmt=sync&auth=sc" -c - 2> /dev/null | grep ZM_AUTH_TOKEN | awk '{print $NF}')
    echo '"userToken":"'$token'"' >> $CONF_CONFIG_TMP
    unset username
    unset userPass
  else
    echo $line >> $CONF_CONFIG_TMP
  fi
done <$CONF_CONFIG
rm $CONF_CONFIG
mv $CONF_CONFIG_TMP $CONF_CONFIG
