# 簡易購物網站

使用 React + .Net5 開發

## 使用技術

### 前端

React

- Material UI
- Axios

### 後端

.Net5 Webapi

- Swagger
- Identity + Jwt Token + Refresh Token
- EF Core(Code First)
- Repository + UnitOfWork
- Email Server
- SpaServices
- Image Server

### 網站架設

Amazon Web Services

- EC2 Linux 2
- RDS PostgreSQL
- S3

## 資料庫架構

- 商品與貨品規格關聯表
  ![database1](https://github.com/yfz34/CeShop/blob/master/assets/database1.png)

- 購物車與訂單關聯表
  ![database2](https://github.com/yfz34/CeShop/blob/master/assets/database2.png)

## 使用方式

1. 安裝[Dotnet SDK](https://dotnet.microsoft.com/en-us/download)
2. 安裝[Node.js](https://nodejs.org/en/)

### 資料庫建立

1. 安裝[dotnet ef](https://www.nuget.org/packages/dotnet-ef)

```
dotnet tool install --global dotnet-ef --version 5.0.17
```

2. 進入 EF 專案

```
cd .\src\CeShop.Data.EF\
```

3. 至 DesignTimeCeShopDbContextFactory.cs 修改 db connection string
4. 執行 ef-core-commands.bat

```
.\ef-core-commands.bat
```

### 後端服務啟動

1. 進入 Api 專案

```
cd .\src\CeShop.Api\
```

2. 修改 appsettings.json 設定

3. 啟動

```
dotnet run
```

### 前端服務啟動

1. 進入 web 專案

```
cd .\src\CeShop.FrontWeb\ceshop-web\
```

2. 安裝相關套件

```
npm install
```

2. 啟動

```
npm start
```

3. 查看網頁

http://localhost:5000
