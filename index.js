import axios from "axios";
import exfdgpress from "express";
import { createClient } from "redis";
import pkg from "jsonwebtoken";
const {sign}=pkg;
const {verify} = pkg;
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



//get data
app.post("/gd",async (req,res)=>{


    //check if the is valid
    if(req.body.id){

        try {
            verify(req.body.id,process.env.SECRET,async(e,d)=>{
     
                
                if (e){
                    res.sendStatus(403);

                    
                    
                }else{


                    
                    //this is the right token, get the user id
                    //d.id
                    //
                    try {

                        const data = await axios.get(
                            
                            `https://api.whalepass.gg/players/${d.id}/progress?gameId=${process.env.gameId}`
                            ,{
    
                            headers:{
    
                                "X-API-KEY":process.env.API,
                                "X-Battlepass-Id":"cf7fc405-0877-464a-bab8-d0e56508f4e0"
    
                            }
                        });

                        res.send(data.data.battlepassProgress);
                        
                    } catch (error) {
                        console.log(error);
                        
                        res.sendStatus(403)
                    }

                    
                }
    
            })



        } catch (error) {
            res.sendStatus(403);
        }
    }else{

        res.sendStatus(403);
    }


});


//increase experience, to be used in endless mode, can't the user abuse this API?
app.post("/aexp",async(req,res)=>{

    //check if the is valid
    if(req.body.id && req.body.exp > 0){

        try {
            verify(req.body.id,process.env.SECRET,async(e,d)=>{
     
                
                if (e){
                    res.sendStatus(403);

                    
                    
                }else{


                    
                    //this is the right token, get the user id
                    //d.id
                    //
                    try {
                        const data = await axios.post(
                            
                            `https://api.whalepass.gg/players/${d.id}/progress/exp`,{

                                "gameId": process.env.gameId,
                                "additionalExp": req.body.exp
                            }
                            ,{
    
                            headers:{
    
                                "X-API-KEY":process.env.API,
                                "X-Battlepass-Id":"cf7fc405-0877-464a-bab8-d0e56508f4e0"
    
                            }
                        });

                        console.log(data.data.battlepassProgress);
                        res.sendStatus(200);
                        
                    } catch (error) {
                        console.log(error);
                        
                        res.sendStatus(403)
                    }

                    
                }
    
            })



        } catch (error) {
            res.sendStatus(403);
        }
    }else{

        res.sendStatus(403);
    }


})

async function createPlayer(playerID) {

    
    await axios.post("https://api.whalepass.gg/enrollments",{
        "gameId":process.env.gameId,
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