import {useEffect, useState} from "react"
import './todo.css';

export default function Todo(){
    const [title,setTitle] = useState("")
    const [description,setDescription] = useState("")
    const [todos,setTodos] =useState([])
    const [message,setMessage]=useState([])
    const [error,setError]=useState([])
    const [editId,setEditId]=useState(-1)
    const [editTitle,seteditTitle] = useState("")
    const [editDescription,seteditDescription] = useState("")

    //api url getting
    const apiUrl ="http://localhost:8000"
       
    //to create a NewTodo 
    const handleSubmit =() =>{
                          setError("")
                if(title.trim() !=='' && description.trim() !=='' ){
                    fetch(apiUrl+"/todos",{
                        method:"POST",
                        headers:{
                            'content-type':"application/json"
                        },
                        body:JSON.stringify({title,description})
                    }).then((res)=>{
                        if(res.ok){
                            setTodos([...todos,{title,description}])
                            setTitle("")
                            setDescription("")
                            setMessage("Item added Successfully")
                            setTimeout(() => {
                                 setMessage("")
                            }, 3000);
                        }
                       else{
                        setError("unable to create todo item")
                       }
                    }).catch(()=>{
                        setError("unable to create todo item")
                    })
                  
                }
       }

    //get items in database
        useEffect(()=>{
                    getItems()
        },[])

       const getItems =()=>{
        fetch(apiUrl+"/todos")
        .then((res)=> res.json())
        .then((res)=>{
            setTodos(res)
        })
       }
    
       //edit Todo in database
       const handleEdit=(item)=>{
        setEditId(item._id)
        seteditTitle(item.title)
        seteditDescription(item.description)
       }
       const handleUpdate=()=>{
        setError("")
        if(editTitle.trim() !=='' && editDescription.trim() !=='' ){
            fetch(apiUrl+"/todos/"+editId,{
                method:"PUT",
                headers:{
                    'content-type':"application/json"
                },
                body:JSON.stringify({title:editTitle,description:editDescription})
            }).then((res)=>{
                if(res.ok){
                    const updatedtodos =todos.map((item)=>{
                        if(item._id==editId){
                            item.title=editTitle
                            item.description=editDescription
                        }
                        return item;
                    })
                    setTodos(updatedtodos)
                    seteditTitle("")
                    seteditDescription("")
                    setMessage("Item updated Successfully")
                    setTimeout(() => {
                         setMessage("")
                    }, 3000);
                    setEditId(-1)
                }
               else{
                setError("unable to create todo item")
               }
            }).catch(()=>{
                setError("unable to create todo item")
            })
          
        }
       }

       //edit cancel
       const handleEditCancel=()=>{
        setEditId(-1)
       }

       //delete todo in database
       const handleDelete=(_id)=>{
         if ( window.confirm('are you sure to delete?')){
             fetch(apiUrl+'/todos/'+_id,{
                method:"DELETE"
             }) 
             .then(()=>{
               const updatedtodos= todos.filter((item)=>item._id!==_id)
               setTodos(updatedtodos)
             })
         }
       }

       //frontend 
    return <div className="todo p-3 container">
        <div className="row">
            <h3 className="h1 fw-bold">Add Your ToDos 🚀</h3>
            {message && <p className="text-success">{message}</p>}
            <div className="form-group d-flex gap-2">
            <input  value={title} onChange={(e)=>setTitle(e.target.value)} className="form-control rounded border-3" type="text" placeholder="title"/>
            <input value={description} onChange={(e)=>setDescription(e.target.value)} className="form-control rounded border-3" type="text" placeholder="description"/>
            <button className="btn-dark btn " onClick={handleSubmit}>Submit</button>
            </div>
           {error && <p className="text-danger">{error}</p>}
        </div>

<div className="row mt-3 bg">
    <h3 className="h2 fw-bold">Tasks</h3>
    <div className="col-md-6">
    <ul className="list-group ">
        {
            todos.map((item)=>
                <li className="list-group-item d-flex justify-content-between rounded my-1  border-3">
                <div className="d-flex flex-column me-2">
                    {
                        editId ==-1 || editId !==item._id ? <>
                        <span className="fw-bold h4">{item.title}</span>
                        <span>{item.description}</span>
                        </>:<>
            <div className="form-group d-flex gap-2">
            <input value={editTitle} onChange={(e)=>seteditTitle(e.target.value)} className="form-control" type="text" placeholder="title"/>
            <input value={editDescription} onChange={(e)=>seteditDescription(e.target.value)} className="form-control" type="text" placeholder="description"/>
            </div>
                        </>
                    }
                
                </div>
               
                <div className=" d-flex gap-2">
               {editId ==-1 || editId !==item._id  ? <button className="btn btn-warning hover" onClick={()=>handleEdit(item)}>Edit</button>:<button onClick={handleUpdate} className="btn btn-warning hover">Update</button>}
                {editId==-1 || editId !==item._id ?<button className="btn btn-danger hover" onClick={()=>handleDelete(item._id)}>Delete</button>:
                <button className="btn btn-danger hover" onClick={handleEditCancel}>Cancel</button>}
                </div>
            </li> 
            )
        }
          
           
    </ul>
    </div>
        </div>
        <div className="bg img"></div>
</div>
}