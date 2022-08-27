# Llrn-backend

### Clone the repository
```
git clone https://github.com/mateusdayrell/llrn-backend.git
```

### Access the project folder
```
cd llrn-backend
```


### Install the dependencies
```
npm install
```

### Copy .env.example to .env
```
cp .env.example .env
```

### Run the migrations
```
npx sequelize db:migrate
```

### Run the seeders
```
npx sequelize db:seed:all
```

### Serve the aplication
```
npm run dev
```

## Recomendation
To start using the aplication it's recomended to use ***Insomnia***, you can download it on this ***[link](https://insomnia.rest/download)***.<br>
After downloading, you can import the file [Insomnia_llrn-backend_2022-08-18.json](https://github.com/mateusdayrell/llrn-backend/blob/main/Insomnia_llrn-backend_2022-08-18.json) to your Insominia app as explained in this ***[tutorial](https://docs.insomnia.rest/insomnia/import-export-data)***, and start using the application.
