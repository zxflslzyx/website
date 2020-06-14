#!/bin/bash

echo "----------------current dir----------------------"
 
cd $WEB_PATH
echo "----------------current dir----------------------"
ls

echo "----------------pulling source code----------------------"
git pull

echo "changing permissions..."
chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
echo "Finished."
echo "successfully";

