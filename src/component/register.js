import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";


const RegisterComponent = (props) => {

    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        user_name: '',
        password: '',
    });
    const registerAPI = "http://localhost:4000/register";
    const header = {
        "Content-Type": 'application/json'
    }

    const setValue = (event) => {
        
        let name = event.target.name;
        let value = event.target.value;
            setUser({
                ...user,
                [name]: value
            })
    }

    const handleSubmit = (e) => {
        console.log("handleSubmit work");
        e.preventDefault();
        

        const params = {
            first_name: user.first_name,
            last_name: user.last_name,
            user_name: user.user_name,
            password: user.password,
        }

        axios.post(registerAPI, params).then(res => {
            if (res && res.status === 200) {
                const token = res.data.token;
                localStorage.setItem('token',token)
                props.history.push('/login');
                toast.success("Login successfully...");
            } else {
                toast.success("Something Wrong...");
            }
        }).catch(function (error) {
            if (error.response) {
                const response = error.response.data;
                toast.error(response.msg);
            }
        })
    }

    return (
        <div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="card">
                        <div className="card-header">
                            <h1>Register User</h1>
                        </div>
                        <div className="card-body">
                            <div className="container">
                                <form >
                                    <input type="text" placeholder="First Name" value={user.first_name} className="form-control form-group" name="first_name" onChange={(e) => setValue(e)} />
                                    <input type="text" placeholder="Last Name" value={user.last_name} className="form-control form-group" name="last_name" onChange={(e) => setValue(e)} />
                                    <input type="user_name" placeholder="User Name" value={user.user_name} className="form-control form-group" name="user_name" onChange={(e) => setValue(e)} />
                                    <input type="password" placeholder="Password" value={user.password} className="form-control form-group" name="password" onChange={(e) => setValue(e)} />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" onClick={(e) => handleSubmit(e)}>Submit</button>
        </div>
    )
}

export default RegisterComponent;