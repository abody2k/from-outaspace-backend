import axios from "axios";
import exfdgpress from "express";
import * as exp from "express"
var app = exfdgpress();


function createPlayer(playerID) {
    
    axios.post("https://api.whalepass.gg/enrollments",{
        "gameId":"2bcfa666-cae1-470e-ab2e-b249d66005f0",
        "playerId":"0"
    },{headers:{
    
        "X-API-KEY":process.env.API
    }}).then((d)=>{
    
        console.log(d);
        
    })
    // 
    
}
app.listen(5000,()=>{

    

    console.log("sever is up and running");
    createPlayer()
    
})