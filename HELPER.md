# Restore database

### Undo the migrations
```
npx sequelize db:migrate:undo:all
```

### Run the migrations
```
npx sequelize db:migrate
```

### Run the seeders
```
npx sequelize db:seed:all
```

# Create models, migrations and seeders

### Models
```
npx sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string
```

### Migrations
```
npx sequelize migration:generate --name create_users
```

### Seeders
```
npx sequelize seed:generate --name user_seeder
```
