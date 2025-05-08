import axios from "axios";
import { connect } from "puppeteer-real-browser";

const OLX_URL='https://www.olx.pl/sport-hobby/rowery/rowery-gorskie/szczecin/?search%5Border%5D=created_at:desc&search%5Bfilter_float_price:to%5D=700&search%5Bfilter_enum_wheelsize%5D%5B0%5D=27-5&search%5Bfilter_enum_wheelsize%5D%5B1%5D=28&search%5Bfilter_enum_wheelsize%5D%5B2%5D=29&search%5Bfilter_enum_wheelsize%5D%5B3%5D=others';

(async() => {
    const {page, browser} = await connect({
        headless: false,

        args: [],
    
        customConfig: {},
    
        turnstile: true,
    
        connectOption: {},
    
        disableXvfb: false,
        ignoreAllFlags: false,
    });
    await page.goto(OLX_URL, {
        waitUntil: 'domcontentloaded'
    })

    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 50_000);
    });
})()