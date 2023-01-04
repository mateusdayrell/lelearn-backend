# LeLearn API

:round_pushpin: To check the project website [click here!](https://llrn-backend-sjy1.vercel.app/)

## Description
This is the LeLearn API. To acces the Lelearn frontend project [click here.](https://github.com/mateusdayrell/llrn-frontend) <br>
Lelearn is a training platform where you can register videos and set up courses to train your employees, students or whoever you want. Besides, you'll be able to define deadlines for the trainings, follow the progress of the users, manage comments, users, generate reports and much more.

## Technologies used <br>
Click to access the documentation: [NodeJs](https://nodejs.org/en/), [Express](https://expressjs.com/pt-br/), [Sequelize](https://sequelize.org/docs/v6/).

## Project setup <br>

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
After downloading, you can import the file [Insomnia_llrn-backend_2022-08-27.json](https://github.com/mateusdayrell/llrn-backend/blob/main/Insomnia_llrn-backend_2022-08-27.json) to your Insominia app as explained in this ***[tutorial](https://docs.insomnia.rest/insomnia/import-export-data)***, and start using the application.
