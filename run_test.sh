echo on
rm -rf build/
npm run build
psql -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname = 'nominal' AND leader_pid IS NULL" postgresql://db:db@localhost:5432/postgres 
psql -c "drop database nominal" postgresql://db:db@localhost:5432/postgres 
psql -c "create database nominal" postgresql://db:db@localhost:5432/postgres 
psql -c "CREATE EXTENSION pg_trgm;" postgresql://db:db@localhost:5432/nominal 

rm src/migrations/*
npm run makemigrations
npm run migrations
foal run seed