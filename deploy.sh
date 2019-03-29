#!/bin/bash
 
WEB_PATH='/autoFetch'
WEB_USER='lovelucydev'
WEB_USERGROUP='lovelucydev'
 
echo "Start deployment"
cd $WEB_PATH
echo "----------------pulling source code----------------------"
git pull
echo "changing permissions..."
chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
echo "Finished."