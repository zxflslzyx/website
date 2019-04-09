#!/bin/bash
 
WEB_PATH='/autoFetch/website'
WEB_USER='lovelucydev'
WEB_USERGROUP='lovelucydev'

echo "----------------current dir----------------------"
 
cd $WEB_PATH
echo "----------------current dir----------------------"
ls

echo "----------------pulling source code----------------------"
git pull

echo "changing permissions..."
chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
echo "Finished."