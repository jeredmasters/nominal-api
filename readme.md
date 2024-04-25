# Nominal API


## Setup
```
npm install
npm run migrations

```

## Development
```
npm install
npm run migrations
foal run seed
```


## Production

Review CodeDeploy logs
```
tail -f /var/log/aws/codedeploy-agent/codedeploy-agent.log
```

Deploy root
```
/opt/codedeploy-agent/deployment-root/
```