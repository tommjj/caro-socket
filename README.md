# Caro game

## set up

### env

#### server

tạo file .env trong thư mục server với nội dung

```
DATABASE_URL="file:./dev.db"

SECRET_KEY="your secret key"

CORS=["http://192.168.83.7:3000","http://localhost:3000","http://localhost:8080" ]

DOMAIN="localhost"

PORT=8080
```

#### app

tạo file .env.local trong thư mục app với nội dung

```
NEXT_PUBLIC_ORIGIN_API="http://localhost:8080"
```

### install dependencies

#### server

```bash

npm i

npx prisma migrate dev --name init
```

#### app

```bash

npm i
```

### run

#### server

```bash

npm run dev
```

#### app

```bash

npm run dev
```
