import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const TaskComponent = (props) => {

    const [taskData, setTaskData] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem('user_id'));
    const [task, setTask] = useState('');
    const [modal, setModal] = useState(false);
    
    const toggle = () => setModal(!modal);

    useEffect(() => {
        axios.get('http://localhost:4000/getAlltask', {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res && res.status === 200) {
                console.log("task data",res.data);
                setTaskData(res.data);
                
            } else {
                toast.error("something wrong...");
            }
        }).catch(error => {
            toast.error(error);
        })
    }, []);

    const deleteTask = (id) => {
        axios.post(`http://localhost:4000/deleteTask/${id}`).then(res => {
            if (res && res.status === 200) {
                toast.success("Task deleted successfully...");
                window.location.reload();
            } else {
                toast.error("Something wrong");
            }
        }).catch(error => {
            toast.error(error);
        })
    }

    const setValue = (e) => {
        let value = e.target.value;
        setTask(value);
    }

    const createTask = (e) => {
        e.preventDefault();
        
        const params = {
            user_id: userId,
            task_name:task
        }
        axios.post('http://localhost:4000/createTask', params, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res && res.status === 200) {
                const data = res.data;
                setTaskData([...taskData, data]);
                setModal(false)
                window.location.reload();
            } else {
                console.log("something wrong");
            }
        }).catch(error => {
            console.log("error", error);
        })

    }

   

    const logoutClick = () => {
        axios.post(`http://localhost:4000/logout/`).then(res => {
            if (res && res.status === 200) {
                localStorage.clear();
                props.history.push(`${process.env.PUBLIC_URL}/login`);
            } else {
                const error = res.payload;
            }
        })
    }

    return (
        <Fragment>
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <button className="btn-primery" type="button" onClick={logoutClick} >Logout</button>
                            <div className="card">
                                <div className="card-header">
                                    <h1>Display Task</h1>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <Button color="danger" onClick={toggle}>Create Task</Button>
                                        <Modal isOpen={modal} toggle={toggle}>
                                            <ModalHeader toggle={toggle}>Add Task</ModalHeader>
                                            <ModalBody>
                                                <form>
                                                    <input type="task_name" placeholder="Enter Task" name="task_name" onChange={(e) => setValue(e)} className="form-control form-group" />
                                                </form>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={(e) => createTask(e)}>Submit</Button>{' '}
                                                <Button color="secondary" onClick={toggle}>Cancel</Button>
                                            </ModalFooter>
                                        </Modal>
                                    </div>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">User Name</th>
                                                <th scope="col">Task</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                taskData ?
                                                    taskData.map((data, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{data?.user_id?.first_name || data.user_id}</td>
                                                                <td>{data.task_name}</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-success" onClick={() => deleteTask(data._id)}>Delete</button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                    :
                                                    ''
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default TaskComponent;