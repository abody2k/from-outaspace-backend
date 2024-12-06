import axios from "axios";
import exfdgpress from "express";
import { createClient } from "redis";
import pkg from "jsonwebtoken";
const {sign}=pkg;
var app = exfdgpress();
app.use(exfdgpress.json())


app.post("/cp",async (req,res)=>{



    try {

  
          //read from redis the next playerID
          const client =await createClient({
            url:`redis://default:${process.env.REDIS}@redis-17431.c52.us-east-1-4.ec2.redns.redis-cloud.com:17431`
        }).on('error',(e)=>{

            console.log(e);
            
        }).connect();

        const playerID=await client.get("nextPlayerId");

        await createPlayer(Number(playerID));
        console.log(`current player ID is ${playerID}`);
        
        await client.set("nextPlayerId",Number(playerID)+1);
        console.log("Just made a player");
        const token=sign({id:Number(playerID)},process.env.SECRET,{expiresIn:"100y"});
        res.send(
           { id : token}
        );
        

    } catch (error) {//player already exists
        res.sendStatus(403);
    }





});



async function createPlayer(playerID) {

    
    await axios.post("https://api.whalepass.gg/enrollments",{
        "gameId":"2bcfa666-cae1-470e-ab2e-b249d66005f0",
        "playerId":playerID
    },{headers:{
    
        "X-API-KEY":process.env.API
    }})
    
}


function getAPlayer(playerID){



}
app.listen(5000,async()=>{

    
console.log("Server is up and running");


    
})