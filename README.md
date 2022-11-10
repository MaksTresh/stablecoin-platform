# Stablecoin Platform

## Подготовка перед запуском

Нужно переименовать файлы:
- backend/.env.example на **.env**
- blockchain/.env.example на **.env**

Описание .env файлов:
```dotenv
AUTH_SECRET_KEY=key_for_auth  # ОБЯЗАТЕЛЬНО ПОМЕНЯТЬ! Переменная, содержащая секрет для алгоритма шифрования в JWT (должен быть одинаковым в двух .env файлах!)
BLOCKCHAIN_HOST=blockchain  # IP-адрес машины, где запущен blockchain-сервис
```

## Запуск

- Первый запуск приложения:
```commandline
docker-compose build
docker-compose up
docker-compose exec backend aerich init -t aerich_config.TORTOISE_ORM 
docker-compose exec backend aerich init-db
docker-compose exec backend aerich migrate
docker-compose exec backend aerich upgrade

docker-compose exec blockchain aerich init -t aerich_config.TORTOISE_ORM 
docker-compose exec blockchain aerich init-db
docker-compose exec blockchain aerich migrate
docker-compose exec blockchain aerich upgrade
```

- Остановить приложение:
```commandline
docker-compose down
```

- Дальнейшие запуски приложения можно осуществить, воспользовавшись командой:
```commandline
docker-compose up
```
- Фронт:
```
npm i --force
expo start
```
