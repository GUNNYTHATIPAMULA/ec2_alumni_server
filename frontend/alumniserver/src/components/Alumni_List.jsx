import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { api } from '../services/api';

const Alumni_List = () => {
    const[alumni,setAlumni] = useState(null);
    const[isEdit,setIsEdit] = useState(false);
    const[name,setName] = useState("");
    useEffect(()=>{
        fetchAlumni();
    },[])
    const fetchAlumni = async() =>{
        try{
            const res = await api.get("/alumni/profile")
            setAlumni(res.data)
        }
        catch(err){
            console.log(err)
        }
    }
    const handleEdit = async(e) =>{
        e.preventDefault();
        try{
            const res = await api.put("/alumni/profile",{full_name:name})
            setAlumni(res.data)
            setIsEdit(false);
        }
        catch(err){
            console.log(err)
        }}
  return (
    <div>
        <h1>Alumni List</h1>
       <ul>
        {alumni ? (<>
        <li>{alumni.full_name} - {alumni.bio}</li>
        </>):(<p>Loading...</p>)}
        <button onClick={()=>setIsEdit(true)}>{isEdit ? "Cancel" : "Edit"}</button>
        {isEdit && (<>
<form onSubmit={handleEdit}>
            <input type="text" value={name} placeholder="Enter name" onChange={(e) => setName(e.target.value)} />
            <button type="submit">Save</button>
</form>        </>)}
       </ul>
    </div>
  )
}

export default Alumni_List