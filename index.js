const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.listen(8081, function() {
    console.log("Server started at port http://localhost:8081/");
})

const db = [
    {"0": {nome: "Sirius", idade: 24, sexo: 'M'}},
    {"1": {nome: "Isac", idade: 19,sexo: 'M'}},
    {"2": {nome: "Maria", idade: 21,sexo: 'F'}},
    {"3": {nome: "Patrik", idade: 18,sexo: 'M'}}
]

app.get('/', (req, res) => {
    return res.json(db);
})

app.get('/scrapy', async(req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    var url = "https://www.lojanovaeragames.com.br/api/categoria/117/PS5%20-%20Jogos&pag1=1&ordenar=des&itens=12";
    await page.goto(url);

    const pageContent = await page.evaluate(() => {
        const content_name = document.querySelectorAll("h5.nome-prod-desktop");
        const content_price = document.querySelectorAll("span.preco-por");
        var list_name = [];
        var list_price = [];

        for (let value of content_name) {
            list_name.push(value.innerText);
        }
        for (let value of content_price) {
            list_price.push(value.innerText);
        }
        return {
            list_name, list_price
        }
    })
    await browser.close();
    return res.send(pageContent);
})

app.post('/post', (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).end;
    }
    db.push(body);
    return res.json(body);
})

app.delete('/del/:identificador', (req, res) => {
    const identificador = parseInt(req.params.identificador);
    if (!identificador) {
        return res.status(400).end;
    }
    let newDb = db.splice(identificador, 1);
    return res.send(newDb);
})