

#!/bin/bash

# sudo yum update

# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# nvm install --lts

sudo yum update
sudo yum install nodejs-legacy -y
sudo yum install npm  -y
sudo npm install pm2 -g

npm install typeorm