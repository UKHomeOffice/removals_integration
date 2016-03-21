#!/usr/bin/env bash

if [[ "start test run migrations" =~ $1 ]]; then
    CMD=( $( which npm ) )
    CMD+=( "${@:1}" )
else
    CMD=( "$@" )
fi

#Pickup any secrets
for f in /etc/secrets/* ; do 
    if test -f "$f"; then
        export $(echo $(basename $f) | awk '{print toupper($0)}')="$(eval "echo \"`<$f`\"")" 
    fi
done

exec ${CMD[*]}
