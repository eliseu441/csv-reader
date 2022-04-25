import { Request, Response, Router }from "express";
import { Readable }from "stream";
import readline from "readline"

import multer from "multer";

const multerConfig = multer();

const router = Router();

router.post(
        "/products", 
        multerConfig.single("file"), 
        async (request: Request, response: Response) =>{
        const { file } = request;
        const buffer = file?.buffer; 
        const readableFile = new Readable();
        readableFile.push(buffer);
        readableFile.push(null);

        const productsLine = readline.createInterface({
                input: readableFile
        })
        const products = [];
        const time = [];
        var acess = 0
        for await (let line of productsLine) {
                const productLineSplit = line.split(",");

                

                let hour = Number(productLineSplit[5].substr(13,2));
                let dia = productLineSplit[5].substr(7,5);
                if(Number(products[products.length -1]?.hour) === Number(hour)){
                        acess = ++acess
                }else{
                        
                        time.push({
                                acessos: acess,
                                horario: products[products.length -1]?.hour,
                                dia: dia
                        });
                        acess = 0
                }
                products.push({
                        hour
                })
                console.log(acess);
        }

        return response.json(time);
})
 
export {router};