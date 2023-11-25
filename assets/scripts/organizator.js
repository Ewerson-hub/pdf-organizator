const fs = require("fs");
const path = require("path");

const pdfsPath = `pdfs`;

const dataScheema = {
        0:{
            "acronym": "NF",
            "dirName": "Notas Ficais",
            "items" : []
        },
        1:{
            "acronym": "ORÇ",
            "dirName": "Orçamentos",
            "items" : []
        },
        2:{
            "acronym": "PD",
            "dirName": "Pedidos",
            "items" : []
        },
        3:{
            "acronym": "PT",
            "dirName": "Pareceres",
            "items" : []
        },
        4:{
            "acronym": "",
            "dirName": "Outros",
            "items" : []
        }
}

function startOrganization(){
    fs.readdir(pdfsPath, (err, data) => {
        if (err) throw err
        data.map(e => {

            if(checkIFIsAPdf(e)){
                fs.stat(`./pdfs/${e}`,(err, archives) => {
                    if (err) throw err;
        
                    let date = formatDate(archives.ctime);
                    classifyItems(e, date);
                });
            }

        });

        
        createDirs(dataScheema);
        createSubDirsByDate(dataScheema);
        moveItems(dataScheema);
    })
}


function classifyItems(item, date){
    for (const i in dataScheema) {
       if(item.indexOf(dataScheema[i].acronym) != -1){
            dataScheema[i].items.push([item, date]);
            break;
       }
    }
}

function createDirs(scheema) {
    for(let i in scheema){
        if(scheema[i].items.length > 0){
            if(!checkIfDirExists(`pdfs/${scheema[i].dirName}`)){
                makeDir(scheema[i].dirName);
            }
        }
       
    }
}
function createSubDirsByDate(scheema) {
    for(let i in scheema){
        for (const y in scheema[i].items) {
            if(!checkIfDirExists(`pdfs/${scheema[i].dirName}/${scheema[i].items[y][1]}`)){

                makeDir(`${scheema[i].dirName}/${scheema[i].items[y][1]}`);

            } 
        }   
    }
}


function makeDir(path){
    fs.mkdir(`pdfs/${path}`, {recursive:true}, (err) => {
        if (err) throw err;
    })
}

function moveItems(scheema){
    for (const i in scheema) {
         for (const y in scheema[i].items) {
            if(fs.existsSync(`pdfs/${scheema[i].dirName}`)){
                let obj = {
                    "dirName" : scheema[i].dirName,
                    "name":scheema[i].items[y][0],
                    "date":scheema[i].items[y][1]
                }
                console.log('cheogu3')
                fs.renameSync(`pdfs/${obj.name}`, `pdfs/${obj.dirName}/${obj.date}/${obj.name}`, err => {
                    if (err) throw err;
                })
            }
         }
    }
    
}

function formatDate(date){
    return JSON.stringify(date).split("").splice(6,2).join("");
}
function checkIfDirExists(path){
    return fs.existsSync(path)
}
function checkIFIsAPdf(item){
    return (path.extname(item) == ".pdf")? true:false;
}
