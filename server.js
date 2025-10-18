import exp from 'express'
// const mysql = require("mysql2/promise.js")
import telbot from 'node-telegram-bot-api'
const app = exp()
import jsdom from 'jsdom'

const { JSDOM } = jsdom

import puppeteer from 'puppeteer'


const token = process.env.TOKEN

const bot = new telbot(token, {
    polling: true
})


let html = `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
       
    </style>
</head>

<body>
    <div class="" style="margin:0 20px;">
        <div class="" style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
            <h1 style="width: 300px;margin-top: 50px;">
                UPDATED JETTIES ALLOCATION LIST
            </h1>
            <h3 style="font-weight: lighter;margin-right: 20px; background-color: rgba(187, 187, 187, 0.504);padding: 10px 15px;border-radius: 12px;">
                1404/07/25
            </h3>
        </div>
        <table>
            <tr>
                <th>DATE</th>
                <th>VESSEL NAME</th>
                <th>JETTY NUMBERS</th>
            </tr>
            <tr>
                <td>1404.10.25</td>
                <td>GOING</td>
                <td>12345</td>
            </tr>
        </table>
    </div>
</body>

</html>`;

let style = ` * {
            padding: 0;
            margin: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        table {
            margin-top: 50px;
            border: 0;
            border-radius: 12px;
            overflow: hidden;
            width: 100%;

            tr {
                text-align: center;


                th {
                    padding: 10px 20px;
                    background-color: #E9EDF6;
                    border: 0;
                }

                td {
                    padding: 10px 20px;
                    text-align: center;
                    background-color: #F9FAFE;
                }

                &:first-child {
                    background-color: #E9EDF6;

                    th {
                        padding: 10px 20px;
                        background-color: #E9EDF6;
                        border: 0;
                    }
                }
            }
        }`

bot.on("message", msg => {
    let dom = new JSDOM(html)
    const styleTag = dom.window.document.createElement("style");
    styleTag.textContent = style;
    dom.window.document.head.appendChild(styleTag);

    async function table() {
        let rows = msg.text.split(/\r?\n/)
        rows.forEach((row => {
            let rowEle = dom.window.document.createElement("tr")
            row.split(",").forEach(ele => {

                let tdELe = dom.window.document.createElement("td")
                tdELe.innerHTML = ele
                rowEle.appendChild(tdELe)
            })

            dom.window.document.querySelector("table").insertAdjacentElement('beforeend', rowEle)
            // dom.window.document.querySelector("table").insertAdjacentElement('beforeend',rowEle)
        }))

        screenShot(dom).then(() => {
            console.log(true)
        }).catch(err => console.log(`err : ${err}`))
    }
    async function screenShot(pageElements) {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        page.setViewport({ width: 800, height: 600 })
        await page.setContent(pageElements.serialize())
        await page.screenshot({ path: "table.png" })

        await browser.close()
    }
    table()

})




app.listen(8080, (err) => err ? console.log(err) : console.log("server online!"))