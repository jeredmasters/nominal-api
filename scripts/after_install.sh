sudo systemctl daemon-reload
sudo systemctl enable nominal-api

cd /var/app
npm install
npm run migrations