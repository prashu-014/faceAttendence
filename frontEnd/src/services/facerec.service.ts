import axios from "axios";



const createFaceRec =(data:any)=>{
    return axios.post(`http://localhost:8080/api/detections`,data)
    
}
