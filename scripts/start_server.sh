cd /var/app

npm install
npm run migrations
npm run start

pm2 stop all
pm2 start /var/app