#!/usr/bin/env bash

if [[ "start test run" =~ $1 ]]; then
    CMD=( $( which npm ) )
    CMD+=( "${@:1}" )
else
    CMD=( "$@" )
fi

#Pickup any secrets
for f in /etc/secrets/* ; do 
    if test -f "$f"; then 
        export "$(basename $f)=$(cat $f)"
    fi
done

exec ${CMD[*]}
